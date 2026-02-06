import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import StudentDashboard from '../pages/StudentDashboard';
import TeacherPortal from '../pages/TeacherPortal';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import AIQuizCreator from '../pages/AIQuizCreator';
import AIQuizCreatorV2 from '../pages/AIQuizCreatorV2';
import ManualQuizEditor from '../pages/ManualQuizEditor';
import StepByStepCreator from '../pages/StepByStepCreator';
import ActiveQuiz from '../pages/ActiveQuiz';
import QuizManagement from '../pages/QuizManagement';
import PerformanceFeedback from '../pages/PerformanceFeedback';
import QuizProgress from '../pages/QuizProgress';
import QuizConfigModal from '../pages/QuizConfigModal';
import TeacherClasses from '../pages/TeacherClasses';
import StudentReports from '../pages/StudentReports';

function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />

                    {/* Student routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/dashboard" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/quiz-management" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <QuizManagement />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/quiz/:id" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <ActiveQuiz />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/active/:id" element={
                        <ProtectedRoute>
                            <ActiveQuiz />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/feedback" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <PerformanceFeedback />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/feedback/:attemptId" element={
                        <ProtectedRoute>
                            <PerformanceFeedback />
                        </ProtectedRoute>
                    } />


                    {/* Teacher routes */}
                    <Route path="/teacher" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <TeacherPortal />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/portal" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <TeacherPortal />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/create/ai" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <AIQuizCreator />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/create/ai-v2" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <AIQuizCreatorV2 />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/create/manual" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <ManualQuizEditor />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/create/step-by-step" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <StepByStepCreator />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/classes" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <TeacherClasses />
                        </ProtectedRoute>
                    } />
                    <Route path="/teacher/reports" element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <StudentReports />
                        </ProtectedRoute>
                    } />

                    {/* Shared authenticated routes */}
                    <Route path="/quiz/progress" element={
                        <ProtectedRoute>
                            <QuizProgress />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/config" element={
                        <ProtectedRoute>
                            <QuizConfigModal />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default AppRouter;
