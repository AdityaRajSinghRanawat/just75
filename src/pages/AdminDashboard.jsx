import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  fetchSemesters,
  fetchHolidays,
  createSemester,
  createHoliday,
  deleteHoliday,
  updateHoliday,
  deleteSemester,
  updateSemester,
} from "../lib/api";
import {
  AddSemesterModal,
  AddHolidayModal,
  ConfirmModal,
} from "../components/Modal";
import AppPageLayout from "../components/layout/AppPageLayout";
import {
  AdminDashboardIntro,
  AdminMessage,
  SemestersSection,
  HolidaysSection,
  AdminAccessRequired,
} from "../components/pages/admin";

export default function AdminDashboard() {
  const { isSignedIn } = useUser() || {};
  const [semesters, setSemesters] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);
  const [showSemesterDeleteConfirm, setShowSemesterDeleteConfirm] = useState(false);
  const [semesterDeleteTarget, setSemesterDeleteTarget] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const semestersList = await fetchSemesters();
      setSemesters(semestersList);
    } catch (err) {
      setSemesters([]);
    }

    try {
      const holidaysList = await fetchHolidays();
      setHolidays(holidaysList);
    } catch (err) {
      setHolidays([]);
    }
    setLoading(false);
  }

  async function handleAddSemester(payload) {
    try {
      if (editingSemester) {
        await updateSemester(editingSemester._id, payload);
        setMessage("Semester updated!");
        setEditingSemester(null);
      } else {
        await createSemester(payload);
        setMessage("Semester created!");
      }
      setShowSemesterModal(false);
      setTimeout(() => setMessage(""), 2000);
      await load();
    } catch (err) {
      setMessage(
        "Failed: " +
          (err?.response?.data?.message || err?.message || "Unknown error"),
      );
      setTimeout(() => setMessage(""), 2000);
      setShowSemesterModal(false);
      setEditingSemester(null);
    }
  }

  async function handleAddHoliday(payload) {
    try {
      if (editingHoliday) {
        await updateHoliday(editingHoliday._id, payload);
        setMessage("Holiday updated!");
        setEditingHoliday(null);
      } else {
        await createHoliday(payload);
        setMessage("Holiday added!");
      }
      setShowHolidayModal(false);
      setTimeout(() => setMessage(""), 2000);
      const list = await fetchHolidays();
      setHolidays(list);
    } catch (err) {
      setMessage(
        "Failed: " +
          (err?.response?.data?.message || err?.message || "Unknown error"),
      );
      setTimeout(() => setMessage(""), 2000);
      setShowHolidayModal(false);
    }
  }

  async function handleDeleteHoliday() {
    if (!deleteTarget) return;
    try {
      await deleteHoliday(deleteTarget);
      setHolidays((prev) => prev.filter((h) => h._id !== deleteTarget));
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
      setMessage("Holiday deleted!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(
        "Failed: " +
          (err?.response?.data?.message || err?.message || "Unknown error"),
      );
      setTimeout(() => setMessage(""), 2000);
    }
  }

  async function handleDeleteSemester() {
    if (!semesterDeleteTarget) return;
    try {
      await deleteSemester(semesterDeleteTarget);
      setSemesters((prev) => prev.filter((s) => s._id !== semesterDeleteTarget));
      if (selectedSemester === semesterDeleteTarget) {
        setSelectedSemester("");
        setHolidays([]);
      }
      setSemesterDeleteTarget(null);
      setShowSemesterDeleteConfirm(false);
      setMessage("Semester deleted!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(
        "Failed: " +
          (err?.response?.data?.message || err?.message || "Unknown error"),
      );
      setTimeout(() => setMessage(""), 2000);
    }
  }

  const mainContent = (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
      <AdminDashboardIntro />
      <AdminMessage message={message} />

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6 md:space-y-8">
        <SemestersSection
          loading={loading}
          semesters={semesters}
          selectedSemester={selectedSemester}
          onSelectSemester={setSelectedSemester}
          onCreateSemester={() => setShowSemesterModal(true)}
          onEditSemester={(semester) => {
            setEditingSemester(semester);
            setShowSemesterModal(true);
          }}
          onDeleteSemester={(semesterId) => {
            setSemesterDeleteTarget(semesterId);
            setShowSemesterDeleteConfirm(true);
          }}
        />

        <HolidaysSection
          holidays={holidays}
          onAddHoliday={() => {
            setEditingHoliday(null);
            setShowHolidayModal(true);
          }}
          onEditHoliday={(holiday) => {
            setEditingHoliday(holiday);
            setShowHolidayModal(true);
          }}
          onDeleteHoliday={(holidayId) => {
            setDeleteTarget(holidayId);
            setShowDeleteConfirm(true);
          }}
        />
      </div>
    </div>
  );

  if (!isSignedIn) {
    return (
      <AppPageLayout showProfile={false} mainClassName="p-8">
        <AdminAccessRequired />
      </AppPageLayout>
    );
  }

  return (
    <AppPageLayout showProfile={true} mainClassName="p-4 md:p-8">
      {mainContent}

      <AddSemesterModal
        isOpen={showSemesterModal}
        onClose={() => {
          setShowSemesterModal(false);
          setEditingSemester(null);
        }}
        onSubmit={handleAddSemester}
        initialData={editingSemester}
      />
      <AddHolidayModal
        isOpen={showHolidayModal}
        initialData={editingHoliday}
        onClose={() => {
          setShowHolidayModal(false);
          setEditingHoliday(null);
        }}
        onSubmit={handleAddHoliday}
      />
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Holiday"
        message="Are you sure you want to delete this holiday?"
        onConfirm={handleDeleteHoliday}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      <ConfirmModal
        isOpen={showSemesterDeleteConfirm}
        title="Delete Semester"
        message="Are you sure you want to delete this semester?"
        onConfirm={handleDeleteSemester}
        onCancel={() => setShowSemesterDeleteConfirm(false)}
      />
    </AppPageLayout>
  );
}
