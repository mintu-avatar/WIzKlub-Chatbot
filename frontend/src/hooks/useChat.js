/**
 * useChat — reducer-based chat engine.
 * `dispatch` from useReducer is ALWAYS stable, so timer callbacks
 * never capture stale state. This eliminates every closure bug.
 */
import { useReducer, useRef, useEffect } from 'react';
import { FLOW, BOT_STATES, resolveMessages } from '../flows/chatFlow.js';
import { saveLead } from '../utils/api.js';

// ─── Unique id helper ────────────────────────────────────────────────────────
let _id = 0;
const uid = () => `msg-${++_id}`;

// ─── Reducer ─────────────────────────────────────────────────────────────────
const INIT = {
  messages:     [],
  currentState: null,
  isTyping:     false,
  inputEnabled: false,   // renamed from !inputDisabled for clarity
  isComplete:   false,
  leadData:     {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return { ...INIT };
    case 'TYPING_ON':
      return { ...state, isTyping: true, inputEnabled: false };
    case 'ADD_BOT_MSG':
      return { ...state, messages: [...state.messages, { id: uid(), role: 'bot', text: action.text }] };
    case 'ADD_USER_MSG':
      return { ...state, messages: [...state.messages, { id: uid(), role: 'user', text: action.text }], inputEnabled: false };
    case 'SET_STATE':
      return { ...state, currentState: action.state };
    case 'TYPING_DONE':
      return { ...state, isTyping: false, inputEnabled: !action.isFinal, isComplete: !!action.isFinal };
    case 'UPDATE_LEAD':
      return { ...state, leadData: action.data };
    case 'DISABLE_INPUT':
      return { ...state, inputEnabled: false };
    default:
      return state;
  }
}

// ─── Timer delay between bot bubbles ────────────────────────────────────────
const BUBBLE_DELAY = 700;

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useChat() {
  const [state, dispatch] = useReducer(reducer, INIT);

  // Stable refs
  const timers     = useRef([]);
  const mounted    = useRef(true);
  const leadSaved  = useRef(false);

  // dispatch is stable — safe to use inside timers without listing as dep
  const d = dispatch; // alias for brevity

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  // ── Clear all pending timers ─────────────────────────────────────────────
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // ── Schedule safely ──────────────────────────────────────────────────────
  const later = (fn, ms) => {
    const id = setTimeout(() => { if (mounted.current) fn(); }, ms);
    timers.current.push(id);
  };

  // ── Stream messages one by one, then fire done() ─────────────────────────
  const stream = (texts, done) => {
    d({ type: 'TYPING_ON' });
    let i = 0;

    const next = () => {
      if (i >= texts.length) {
        later(() => done(), BUBBLE_DELAY / 2);
        return;
      }
      const text = texts[i++];
      later(() => {
        d({ type: 'ADD_BOT_MSG', text });
        next();
      }, BUBBLE_DELAY);
    };

    next();
  };

  // ── Advance to a flow state and stream its messages ──────────────────────
  const goToState = (stateKey, leadData) => {
    const step = FLOW[stateKey];
    if (!step) return;

    d({ type: 'SET_STATE', state: stateKey });

    const texts = resolveMessages(stateKey, leadData);

    stream(texts, () => {
      d({ type: 'TYPING_DONE', isFinal: !!step.isFinal });
    });
  };

  // ── Public: start / restart conversation ────────────────────────────────
  const startChat = () => {
    clearTimers();
    leadSaved.current = false;
    d({ type: 'RESET' });

    // Brief pause so React can commit the RESET before we start streaming
    later(() => goToState(BOT_STATES.WELCOME, {}), 120);
  };

  // ── Public: handle user reply (quick-select or text input) ───────────────
  const handleUserInput = (value, displayLabel) => {
    const { currentState, leadData, inputEnabled } = state;
    if (!inputEnabled || !currentState) return;

    const step = FLOW[currentState];
    if (!step?.next) return;

    d({ type: 'ADD_USER_MSG', text: displayLabel ?? value });

    const { state: nextState, dataKey, extra } = step.next(value, leadData);
    const updatedData = {
      ...leadData,
      [dataKey]: extra !== undefined ? extra : value,
    };

    d({ type: 'UPDATE_LEAD', data: updatedData });

    if (FLOW[nextState]?.isFinal && !leadSaved.current) {
      leadSaved.current = true;
      saveLead(updatedData).catch((e) => console.error('Lead save failed:', e));
    }

    goToState(nextState, updatedData);
  };

  const currentStep = state.currentState ? FLOW[state.currentState] : null;

  return {
    messages:     state.messages,
    currentState: state.currentState,
    currentStep,
    isTyping:     state.isTyping,
    inputEnabled: state.inputEnabled,
    isComplete:   state.isComplete,
    leadData:     state.leadData,
    startChat,
    handleUserInput,
  };
}
