import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Fingers from './Fingers';

describe('Fingers component', () => {
  test('renders all fingers', () => {
    const { container } = render(<Fingers nextKey={null} />);
    // 指全体を示すセレクタを確認
    const fingers = container.querySelectorAll('.lefthand .w-8, .righthand .w-8');
    expect(fingers.length).toBe(10);
  });

  test('highlights correct finger for given key', () => {
    // `A`キーは左手の小指に対応
    const { container } = render(<Fingers nextKey="A" />);
    const fingers = container.querySelectorAll('.lefthand .w-8');
    const finger = fingers[0].querySelector('.rounded-full');
    expect(finger).not.toBeNull();
    expect(finger).toHaveStyle('background-color: #ff6363');

    // `K`キーは右手の中指に対応
    const { container: container2 } = render(<Fingers nextKey="K" />);
    const fingers2 = container2.querySelectorAll('.righthand .w-8');
    const finger2 = fingers2[2].querySelector('.rounded-full');
    expect(finger2).not.toBeNull();
    expect(finger2).toHaveStyle('background-color: #ff6363');
  });

  test('does not highlight any finger when nextKey is null', () => {
    const { container } = render(<Fingers nextKey={null} />);
    const fingers = container.querySelectorAll('.lefthand .w-8, .righthand .w-8');
    fingers.forEach(finger => {
      const element = finger.querySelector('.rounded-full');
      expect(element).not.toBeNull();
      expect(element).toHaveStyle('background-color: #00b4d8');
    });
  });
});