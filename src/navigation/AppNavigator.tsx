import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FloatingTabBar} from '../components/FloatingTabBar';
import {locations, stories} from '../data/content';
import {
  loadOnboardingSeen,
  loadPhotoLogs,
  loadSavedItems,
  saveOnboardingSeen,
  savePhotoLogs,
  saveSavedItems,
} from '../storage/appStorage';
import type {
  DetailRoute,
  PhotoLog,
  SavedEntityType,
  SavedItem,
  TabId,
} from '../types';
import {FactsScreen} from '../screens/FactsScreen';
import {LoaderScreen} from '../screens/LoaderScreen';
import {LocationDetailScreen} from '../screens/LocationDetailScreen';
import {MapScreen} from '../screens/MapScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {PhotoLogScreen} from '../screens/PhotoLogScreen';
import {QuizScreen} from '../screens/QuizScreen';
import {SavedScreen} from '../screens/SavedScreen';
import {StoriesScreen} from '../screens/StoriesScreen';
import {StoryDetailScreen} from '../screens/StoryDetailScreen';

type Stage = 'loader' | 'onboarding' | 'main';

function sameItem(left: SavedItem, right: SavedItem) {
  return left.type === right.type && left.id === right.id;
}

export function AppNavigator(): React.JSX.Element {
  const [stage, setStage] = useState<Stage>('loader');
  const [activeTab, setActiveTab] = useState<TabId>('stories');
  const [detail, setDetail] = useState<DetailRoute | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [photoLogs, setPhotoLogs] = useState<PhotoLog[]>([]);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const boot = async () => {
      const [seen, saved, logs] = await Promise.all([
        loadOnboardingSeen(),
        loadSavedItems(),
        loadPhotoLogs(),
      ]);
      if (!mounted) {
        return;
      }
      setSavedItems(saved);
      setPhotoLogs(logs);
      timer = setTimeout(() => {
        if (mounted) {
          setStage(seen ? 'main' : 'onboarding');
        }
      }, 5000);
    };

    boot();

    return () => {
      mounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    await saveOnboardingSeen();
    setStage('main');
  }, []);

  const isSaved = useCallback(
    (type: SavedEntityType, id: string) =>
      savedItems.some(item => sameItem(item, {type, id})),
    [savedItems],
  );

  const toggleSaved = useCallback((item: SavedItem) => {
    setSavedItems(current => {
      const exists = current.some(value => sameItem(value, item));
      const next = exists
        ? current.filter(value => !sameItem(value, item))
        : [...current, item];
      saveSavedItems(next);
      return next;
    });
  }, []);

  const addPhotoLog = useCallback((log: PhotoLog) => {
    setPhotoLogs(current => {
      const next = [log, ...current];
      savePhotoLogs(next);
      return next;
    });
  }, []);

  const deletePhotoLog = useCallback((id: string) => {
    setPhotoLogs(current => {
      const next = current.filter(log => log.id !== id);
      savePhotoLogs(next);
      return next;
    });
  }, []);

  const openTab = (tab: TabId) => {
    setDetail(null);
    setActiveTab(tab);
  };

  const openStory = (id: string) => setDetail({type: 'story', id});
  const openLocation = (id: string) => setDetail({type: 'location', id});
  const closeDetail = () => setDetail(null);

  if (stage === 'loader') {
    return <LoaderScreen />;
  }

  if (stage === 'onboarding') {
    return <OnboardingScreen onDone={completeOnboarding} />;
  }

  if (detail?.type === 'story') {
    const exists = stories.some(story => story.id === detail.id);
    const id = exists ? detail.id : stories[0].id;
    return (
      <StoryDetailScreen
        id={id}
        saved={isSaved('story', id)}
        onBack={closeDetail}
        onToggleSaved={() => toggleSaved({type: 'story', id})}
      />
    );
  }

  if (detail?.type === 'location') {
    const exists = locations.some(location => location.id === detail.id);
    const id = exists ? detail.id : locations[0].id;
    return (
      <LocationDetailScreen
        id={id}
        saved={isSaved('location', id)}
        onBack={closeDetail}
        onToggleSaved={() => toggleSaved({type: 'location', id})}
      />
    );
  }

  const content = (() => {
    switch (activeTab) {
      case 'map':
        return <MapScreen onOpenLocation={openLocation} />;
      case 'photos':
        return (
          <PhotoLogScreen
            logs={photoLogs}
            onAddLog={addPhotoLog}
            onDeleteLog={deletePhotoLog}
          />
        );
      case 'quiz':
        return <QuizScreen />;
      case 'facts':
        return (
          <FactsScreen
            isSaved={id => isSaved('fact', id)}
            onToggleSaved={id => toggleSaved({type: 'fact', id})}
          />
        );
      case 'saved':
        return (
          <SavedScreen
            savedItems={savedItems}
            onToggleSaved={toggleSaved}
            onOpenStory={openStory}
            onOpenLocation={openLocation}
          />
        );
      case 'stories':
      default:
        return <StoriesScreen onOpenStory={openStory} />;
    }
  })();

  return (
    <View style={styles.root}>
      {content}
      <FloatingTabBar active={activeTab} onChange={openTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
