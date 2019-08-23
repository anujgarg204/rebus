import { createComponent } from '../mini';
import { Char } from './Char';
import { actions } from '../store';

export function Word(props, ...children) {
  return createComponent({
    props,
    children,
    render({ word, charInput }) {
      this.children = word.split('').map((_, charIndex) =>
        Char({
          charIndex,
          ...props,
          onInput: e => {
            const input = e.target.value;
            charInput(input, props.wordIndex, charIndex);

            if (/[a-zA-Z]/.test(input)) {
              const nextChild = e.target.nextElementSibling;
              const hasNextWord = !!this.$element.nextSibling;

              if (nextChild !== null) {
                nextChild.focus();
              }
              if (nextChild === null && hasNextWord) {
                this.$element.nextSibling.firstElementChild.focus();
              }
            }
          },
          onKeydown: e => {
            const { key, keyCode, target } = e;
            if (keyCode >= 65 && keyCode <= 90) {
              target.value = '';
            }
            if (key === 'Enter' || keyCode === 13) {
              actions.shake();
            }
            if (key === 'Backspace' || keyCode === 8) {
              const input = target.value;
              const prevChild = target.previousElementSibling;
              if (prevChild !== null && input === '') {
                prevChild.focus();
                e.preventDefault();
              }
              else if (target.parentElement && input === '') {
                const previousSibling = target.parentElement.previousSibling;
                if (previousSibling) {
                  const lastChildOfParent = previousSibling.lastElementChild;
                  if (lastChildOfParent) {
                    lastChildOfParent.focus();
                    e.preventDefault();
                  }
                }
              }
            }
          }
        })
      );
      return `
          <div class="word">
            <children>
          </div>
        `;
    }
  });
}
