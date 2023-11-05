import { Routes, Route } from "react-router-dom";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
function App() {

  return (
    <Routes>
      <Route path="/teacher" element={<Teacher></Teacher>}></Route>
      <Route path="/student" element={<Student></Student>}></Route>
    </Routes>
  )
}

export default App
