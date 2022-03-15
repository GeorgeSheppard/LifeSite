import { useState, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';

interface ICardWithUuid<T> {
  uuid: string;
  value: T;
}

export const useCardsWithIds = <T>(props: {initialCards: T[], generateValue: () => T}) => {
  const [cards, setCards] = useState<ICardWithUuid<T>[]>(() => 
    props.initialCards.map(card => ({ uuid: uuidv4(), value: card })));

  const replaceIndex = useCallback((index: number, value: Partial<T>) => {
    setCards((prevCards) => {
      const previousCards = [...prevCards];
      const previousCard = previousCards[index];
      previousCards[index] = {
        uuid: previousCard.uuid,
        value: {
          ...previousCard.value,
          ...value
        }
      }
      return previousCards;
    })
  }, [])

  const deleteIndex = useCallback((index: number) => {
    setCards((prevCards) => {
      const previousCards = [...prevCards];
      previousCards.splice(index, 1);
      return previousCards;
    })
  }, [])

  const insertCard = useCallback((index?: number) => {
    const generateValue = props.generateValue;
    setCards((prevCards) => {
      if (!index) {
        index = prevCards.length;
      }

      const newCards = [...prevCards.slice(0, index), { uuid: uuidv4(), value: generateValue()}, ...prevCards.slice(index, prevCards.length - 1)]
      return newCards;
    })
  }, [props.generateValue])

  return {
    insertIndex: insertCard,
    deleteIndex: deleteIndex,
    replaceIndex: replaceIndex,
    cards
  }
}