import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Keyboard from './Keyboard';

describe('Keyboard component', () => {
  test('renders all keys', () => {
    const { getByText } = render(<Keyboard nextKey={null} />);
    const keys: Array<string | ((content: string, element: HTMLElement | null) => boolean)> = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
      (content, element) => content.includes('Backspace'),
      'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\',
      'Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter',
      'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift',
      'Ctrl', 'Alt', ' ', 'Alt', 'Ctrl',
    ];

    keys.forEach(key => {
      if (typeof key === 'string') {
        expect(getByText(key)).toBeInTheDocument();
      } else {
        expect(getByText((content, element) => key(content, element as HTMLElement | null))).toBeInTheDocument();
      }
    });
  });

  test('highlights the next key', () => {
    const nextKey = 'A';
    const { getByText } = render(<Keyboard nextKey={nextKey} />);

    // 指定された nextKey がハイライトされているかを確認
    const highlightedKey = getByText(nextKey);
    expect(highlightedKey).toHaveClass('bg-red-500 text-white');
  });

  test('does not highlight any key when nextKey is null', () => {
    const { getByText } = render(<Keyboard nextKey={null} />);

    // 全てのキーが通常のスタイルであることを確認
    const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    keys.forEach(key => {
      const keyElement = getByText(key);
      expect(keyElement).not.toHaveClass('bg-red-500 text-white');
    });
  });
});
