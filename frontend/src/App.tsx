import { Routes, Route, Navigate } from "react-router-dom";
import Page from "@/pages/page.tsx";
import ChangePage from "@/pages/change-page.tsx";
import Layout from "@/components/layout.tsx";
import AddPage from "@/pages/add-page.tsx";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/announcements" replace />} />
                <Route path="/announcements" element={<Page />} />
                <Route path="/announcements/new" element={<AddPage />} />
                <Route path="/announcements/:id" element={<ChangePage />} />
            </Route>
        </Routes>
    )
}

export default App