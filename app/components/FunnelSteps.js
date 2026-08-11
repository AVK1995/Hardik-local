import { Check } from './Icons';
import { funnelSteps } from '../content';

/**
 * The progress rail across checkout → book → thank-you. Its job is to tell a
 * man mid-payment how much is left, which is the cheapest drop-off fix there
 * is: the funnel takes money on step one, so step one has to look survivable.
 *
 * `current` is the zero-based index of the step being shown.
 */
export default function FunnelSteps({ current = 0 }) {
  return (
    <ol className="fp-steps" data-sdp-reveal aria-label="Checkout progress">
      {funnelSteps.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'now' : 'todo';
        return (
          <li className="fp-step" data-state={state} key={label}>
            <span className="fp-step-dot">
              {state === 'done' ? <Check size={11} /> : i + 1}
            </span>
            <span className="fp-step-l">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
