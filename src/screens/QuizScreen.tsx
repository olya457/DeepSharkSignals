import React, {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Images} from '../assets';
import {HeaderBar} from '../components/HeaderBar';
import {OceanBackground} from '../components/OceanBackground';
import {PrimaryButton} from '../components/PrimaryButton';
import {SurfaceCard} from '../components/SurfaceCard';
import {quizQuestions} from '../data/content';
import {colors, useScreenMetrics} from '../theme';

const letters = ['A', 'B', 'C', 'D'];

export function QuizScreen(): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const metrics = useScreenMetrics();
  const question = quizQuestions[index];
  const progress = useMemo(() => (index + 1) / quizQuestions.length, [index]);

  const answer = (optionIndex: number) => {
    if (selected !== null) {
      return;
    }
    setSelected(optionIndex);
    const correct = optionIndex === question.answerIndex;
    if (correct) {
      setScore(current => current + 1);
    }
    setTimeout(() => {
      if (index === quizQuestions.length - 1) {
        setDone(true);
        return;
      }
      setIndex(current => current + 1);
      setSelected(null);
    }, 850);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return (
    <OceanBackground>
      <View style={[styles.screen, {paddingTop: metrics.top}]}>
        <HeaderBar title="Ocean Signal Quiz" icon="🧾" />
        <View
          style={[
            styles.body,
            {
              paddingHorizontal: metrics.gutter,
              paddingBottom: metrics.navHeight + metrics.bottom + 22,
            },
          ]}>
          <SurfaceCard style={styles.card}>
            {done ? (
              <View style={styles.result}>
                <Image
                  source={Images.sharkMascot}
                  resizeMode="contain"
                  style={styles.resultImage}
                />
                <Text style={styles.resultTitle}>Result</Text>
                <Text style={styles.resultText}>
                  You found {score} of {quizQuestions.length} ocean signals.
                </Text>
                <PrimaryButton
                  title="Play again"
                  onPress={restart}
                  style={styles.resultButton}
                />
              </View>
            ) : (
              <>
                <View style={styles.quizTop}>
                  <Image
                    source={Images.sharkMascot}
                    resizeMode="contain"
                    style={styles.shark}
                  />
                  <View style={styles.progressSide}>
                    <Text style={styles.questionNumber}>
                      Question: {index + 1}
                    </Text>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {width: `${progress * 100}%`},
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <Text style={styles.question}>{question.question}</Text>

                <View style={styles.options}>
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selected === optionIndex;
                    const answered = selected !== null;
                    const isCorrect = optionIndex === question.answerIndex;
                    const isWrong = answered && isSelected && !isCorrect;
                    const correctSelected = answered && isCorrect;

                    return (
                      <Pressable
                        key={option}
                        onPress={() => answer(optionIndex)}
                        style={[
                          styles.option,
                          correctSelected && styles.optionCorrect,
                          isWrong && styles.optionWrong,
                        ]}>
                        <Text
                          numberOfLines={2}
                          adjustsFontSizeToFit
                          style={[
                            styles.optionText,
                            (isWrong || correctSelected) &&
                              styles.optionTextAnswered,
                          ]}>
                          {letters[optionIndex]}) {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </SurfaceCard>
        </View>
      </View>
    </OceanBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingTop: 24,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 30,
  },
  quizTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  shark: {
    height: 94,
    width: 94,
  },
  progressSide: {
    flex: 1,
  },
  questionNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
  },
  progressTrack: {
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 6,
  },
  progressFill: {
    backgroundColor: colors.green,
    borderRadius: 10,
    height: 14,
  },
  question: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 20,
    marginTop: 44,
    textAlign: 'center',
  },
  options: {
    gap: 11,
    marginTop: 36,
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
    height: 68,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  optionCorrect: {
    backgroundColor: colors.panel,
    borderColor: colors.green,
  },
  optionWrong: {
    backgroundColor: colors.red,
  },
  optionText: {
    color: '#00100a',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  optionTextAnswered: {
    color: colors.text,
  },
  result: {
    alignItems: 'center',
  },
  resultImage: {
    height: 112,
    width: 112,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 18,
  },
  resultText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 18,
    textAlign: 'center',
  },
  resultButton: {
    marginTop: 34,
    width: 220,
  },
});
