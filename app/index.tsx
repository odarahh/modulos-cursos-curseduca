import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {
  ArrowLeft,
  Play,
  FileText,
  ClipboardCheck,
  Globe,
  Headphones,
  Type,
  Video,
  Upload,
  Images,
  Layers,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Heart,
  Share2,
  Check,
} from 'lucide-react-native';

type LessonType = 'video' | 'document' | 'assessment' | 'embed' | 'audio' | 'text' | 'live' | 'delivery' | 'gallery' | 'flashcards';

type LessonStatus = 'not_started' | 'in_progress' | 'completed';

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  status: LessonStatus;
  duration?: string;
  isFavorite: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  modules: Module[];
  isFavorite: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

const getLessonIcon = (type: LessonType) => {
  const iconProps = { size: 16, color: '#E9ECEF' };
  
  switch (type) {
    case 'video':
      return <Play {...iconProps} />;
    case 'document':
      return <FileText {...iconProps} />;
    case 'assessment':
      return <ClipboardCheck {...iconProps} />;
    case 'embed':
      return <Globe {...iconProps} />;
    case 'audio':
      return <Headphones {...iconProps} />;
    case 'text':
      return <Type {...iconProps} />;
    case 'live':
      return <Video {...iconProps} />;
    case 'delivery':
      return <Upload {...iconProps} />;
    case 'gallery':
      return <Images {...iconProps} />;
    case 'flashcards':
      return <Layers {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

const getStatusColor = (status: LessonStatus) => {
  switch (status) {
    case 'completed':
      return '#28A745';
    case 'in_progress':
      return '#FFC107';
    case 'not_started':
      return '#6C757D';
    default:
      return '#6C757D';
  }
};

const mockCourse: Course = {
  id: '1',
  title: 'Curso Design Completo',
  thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop',
  progress: 35,
  isFavorite: false,
  modules: [
    {
      id: 'm1',
      title: 'Módulo 1: Fundamentos do Design',
      isExpanded: false,
      lessons: [
        { id: 'l1', title: 'Introdução ao Design', type: 'video', status: 'completed', duration: '15 min', isFavorite: false },
        { id: 'l2', title: 'Princípios Básicos', type: 'document', status: 'completed', duration: '10 min', isFavorite: true },
        { id: 'l3', title: 'Avaliação Inicial', type: 'assessment', status: 'in_progress', duration: '20 min', isFavorite: false },
        { id: 'l4', title: 'Recursos Externos', type: 'embed', status: 'not_started', duration: '5 min', isFavorite: false },
        { id: 'l5', title: 'Podcast Design', type: 'audio', status: 'not_started', duration: '30 min', isFavorite: false },
      ],
    },
    {
      id: 'm2',
      title: 'Módulo 2: Teoria das Cores',
      isExpanded: false,
      lessons: [
        { id: 'l6', title: 'Psicologia das Cores', type: 'text', status: 'not_started', duration: '12 min', isFavorite: false },
        { id: 'l7', title: 'Live: Paletas de Cores', type: 'live', status: 'not_started', duration: '45 min', isFavorite: false },
        { id: 'l8', title: 'Entrega: Paleta Pessoal', type: 'delivery', status: 'not_started', duration: '60 min', isFavorite: false },
        { id: 'l9', title: 'Galeria de Inspirações', type: 'gallery', status: 'not_started', duration: '8 min', isFavorite: false },
        { id: 'l10', title: 'Flashcards: Cores', type: 'flashcards', status: 'not_started', duration: '15 min', isFavorite: false },
      ],
    },
    {
      id: 'm3',
      title: 'Módulo 3: Tipografia',
      isExpanded: false,
      lessons: [
        { id: 'l11', title: 'História da Tipografia', type: 'video', status: 'not_started', duration: '18 min', isFavorite: false },
        { id: 'l12', title: 'Guia de Fontes', type: 'document', status: 'not_started', duration: '25 min', isFavorite: false },
        { id: 'l13', title: 'Quiz Tipográfico', type: 'assessment', status: 'not_started', duration: '15 min', isFavorite: false },
        { id: 'l14', title: 'Ferramenta Online', type: 'embed', status: 'not_started', duration: '10 min', isFavorite: false },
        { id: 'l15', title: 'Áudio: Tendências', type: 'audio', status: 'not_started', duration: '22 min', isFavorite: false },
      ],
    },
    {
      id: 'm4',
      title: 'Módulo 4: Layout e Composição',
      isExpanded: false,
      lessons: [
        { id: 'l16', title: 'Regras de Composição', type: 'text', status: 'not_started', duration: '20 min', isFavorite: false },
        { id: 'l17', title: 'Live: Grid Systems', type: 'live', status: 'not_started', duration: '50 min', isFavorite: false },
        { id: 'l18', title: 'Projeto Final', type: 'delivery', status: 'not_started', duration: '120 min', isFavorite: false },
        { id: 'l19', title: 'Showcase de Layouts', type: 'gallery', status: 'not_started', duration: '12 min', isFavorite: false },
        { id: 'l20', title: 'Cards de Revisão', type: 'flashcards', status: 'not_started', duration: '18 min', isFavorite: false },
      ],
    },
    {
      id: 'm5',
      title: 'Módulo 5: Design Digital',
      isExpanded: false,
      lessons: [
        { id: 'l21', title: 'UI/UX Fundamentals', type: 'video', status: 'not_started', duration: '35 min', isFavorite: false },
        { id: 'l22', title: 'Guia de Ferramentas', type: 'document', status: 'not_started', duration: '15 min', isFavorite: false },
        { id: 'l23', title: 'Avaliação Final', type: 'assessment', status: 'not_started', duration: '40 min', isFavorite: false },
        { id: 'l24', title: 'Prototipagem Online', type: 'embed', status: 'not_started', duration: '25 min', isFavorite: false },
        { id: 'l25', title: 'Podcast: Futuro do Design', type: 'audio', status: 'not_started', duration: '28 min', isFavorite: false },
      ],
    },
  ],
};

export default function CourseScreen() {
  const [course, setCourse] = useState<Course>(mockCourse);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [menuType, setMenuType] = useState<'course' | 'lesson'>('course');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [slideAnim] = useState(new Animated.Value(screenHeight));

  const toggleModule = (moduleId: string) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? { ...module, isExpanded: !module.isExpanded }
          : module
      ),
    }));
  };

  const openMenu = (type: 'course' | 'lesson', lessonId?: string) => {
    setMenuType(type);
    setSelectedLessonId(lessonId || null);
    setShowMenu(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
      setSelectedLessonId(null);
    });
  };

  const toggleCourseFavorite = () => {
    setCourse(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const toggleLessonFavorite = (lessonId: string) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson =>
          lesson.id === lessonId
            ? { ...lesson, isFavorite: !lesson.isFavorite }
            : lesson
        ),
      })),
    }));
  };

  const shareContent = () => {
    console.log('Compartilhar conteúdo');
    closeMenu();
  };

  const handleLessonClick = (lessonId: string) => {
    console.log('Aula clicada:', lessonId);
    // Aqui você pode navegar para a tela da aula ou abrir o conteúdo
  };

  const toggleLessonStatus = (lessonId: string) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            const newStatus: LessonStatus = lesson.status === 'completed' ? 'not_started' : 'completed';
            return { ...lesson, status: newStatus };
          }
          return lesson;
        }),
      })),
    }));
  };

  const renderLesson = (lesson: Lesson) => (
    <View key={lesson.id} style={styles.lessonItem}>
      <TouchableOpacity
        style={styles.lessonLeft}
        onPress={() => handleLessonClick(lesson.id)}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          style={[styles.statusIndicator, { backgroundColor: getStatusColor(lesson.status) }]}
          onPress={() => toggleLessonStatus(lesson.id)}
          activeOpacity={0.8}
        >
          {lesson.status === 'completed' && <Check size={12} color="white" />}
        </TouchableOpacity>
        <View style={styles.lessonIcon}>
          {getLessonIcon(lesson.type)}
        </View>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          {lesson.duration && (
            <Text style={styles.lessonDuration}>{lesson.duration}</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => openMenu('lesson', lesson.id)}
      >
        <MoreVertical size={20} color="#E9ECEF" />
      </TouchableOpacity>
    </View>
  );

  const renderModule = (module: Module) => (
    <View key={module.id} style={styles.moduleCard}>
      <TouchableOpacity
        style={styles.moduleHeader}
        onPress={() => toggleModule(module.id)}
      >
        <Text style={styles.moduleTitle}>{module.title}</Text>
        {module.isExpanded ? (
          <ChevronUp size={20} color="#E9ECEF" />
        ) : (
          <ChevronDown size={20} color="#E9ECEF" />
        )}
      </TouchableOpacity>
      {module.isExpanded && (
        <View style={styles.lessonsContainer}>
          {module.lessons.map(renderLesson)}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color="#E9ECEF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Curso</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Image source={{ uri: course.thumbnail }} style={styles.courseThumbnail} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${course.progress}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>{course.progress}% concluído</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => openMenu('course')}
            >
              <MoreVertical size={20} color="#E9ECEF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.modulesContainer}>
          {course.modules.map(renderModule)}
        </View>
      </ScrollView>

      <Modal
        visible={showMenu}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <Animated.View
            style={[
              styles.menuContainer,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuHandle} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (menuType === 'course') {
                  toggleCourseFavorite();
                } else if (selectedLessonId) {
                  toggleLessonFavorite(selectedLessonId);
                }
              }}
            >
              <Heart
                size={20}
                color={(() => {
                  if (menuType === 'course') {
                    return course.isFavorite ? '#FF6B6B' : '#E9ECEF';
                  } else if (selectedLessonId) {
                    const lesson = course.modules
                      .flatMap(m => m.lessons)
                      .find(l => l.id === selectedLessonId);
                    return lesson?.isFavorite ? '#FF6B6B' : '#E9ECEF';
                  }
                  return '#E9ECEF';
                })()}
                fill={(() => {
                  if (menuType === 'course') {
                    return course.isFavorite ? '#FF6B6B' : 'transparent';
                  } else if (selectedLessonId) {
                    const lesson = course.modules
                      .flatMap(m => m.lessons)
                      .find(l => l.id === selectedLessonId);
                    return lesson?.isFavorite ? '#FF6B6B' : 'transparent';
                  }
                  return 'transparent';
                })()}
              />
              <Text style={styles.menuItemText}>Favoritar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={shareContent}>
              <Share2 size={20} color="#E9ECEF" />
              <Text style={styles.menuItemText}>Compartilhar</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#E9ECEF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#212529',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  courseThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#E9ECEF',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#495057',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28A745',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#ADB5BD',
  },
  modulesContainer: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: '#212529',
    borderRadius: 12,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#E9ECEF',
    flex: 1,
  },
  lessonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#495057',
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIcon: {
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    color: '#E9ECEF',
    marginBottom: 2,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#ADB5BD',
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#212529',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  menuHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#495057',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: '#E9ECEF',
    marginLeft: 12,
  },
});