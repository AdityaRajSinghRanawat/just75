import { useEffect, useState } from "react";
import { fetchSemesters, fetchHolidays } from "../lib/api";
import {
  calculateNetWorkingDays,
  computeProjection,
} from "../utils/calculations";
import { AddExtraModal, AddHolidayModal } from "../components/Modal";
import AppPageLayout from "../components/layout/AppPageLayout";
import {
  SemesterSection,
  DateRangeSection,
  OfficialHolidaysSection,
  AdjustmentsSection,
  AttendanceSection,
  ResultsSection,
} from "../components/pages/student";
import {
  normalizeCalendarDate,
  toLocalDateInputValue,
} from "../components/pages/student/studentPageUtils";

const PERIODS_PER_DAY = 6;

export default function StudentPage() {
  const [semesters, setSemesters] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [semesterId, setSemesterId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasCustomEndDate, setHasCustomEndDate] = useState(false);
  const [currentPresent, setCurrentPresent] = useState("");
  const [currentTotal, setCurrentTotal] = useState("");
  const [desiredPercent, setDesiredPercent] = useState("");
  const [extraHolidays, setExtraHolidays] = useState([]);
  const [extraWorkingDays, setExtraWorkingDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showHolidayEditModal, setShowHolidayEditModal] = useState(false);
  const [editingAdjustment, setEditingAdjustment] = useState(null);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const today = toLocalDateInputValue();
    if (!startDate) {
      setStartDate(today);
    }
  }, [startDate]);

  useEffect(() => {
    fetchSemesters()
      .then(setSemesters)
      .catch(() => setSemesters([]));
  }, []);

  useEffect(() => {
    if (!semesterId) {
      if (holidays.length) setHolidays([]);
      return;
    }
    fetchHolidays(semesterId)
      .then(setHolidays)
      .catch(() => setHolidays([]));
  }, [semesterId]);

  useEffect(() => {
    if (!semesterId || !semesters.length || !startDate || hasCustomEndDate)
      return;

    const semester = semesters.find((s) => s._id === semesterId);
    if (!semester) return;

    const today = normalizeCalendarDate(startDate);
    let defaultEndDate = null;

    if (semester.mid1Date) {
      const mid1 = normalizeCalendarDate(semester.mid1Date);
      if (mid1 >= today) defaultEndDate = toLocalDateInputValue(mid1);
    }

    if (!defaultEndDate && semester.mid2Date) {
      const mid2 = normalizeCalendarDate(semester.mid2Date);
      if (mid2 >= today) defaultEndDate = toLocalDateInputValue(mid2);
    }

    if (!defaultEndDate) {
      const nextMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      defaultEndDate = toLocalDateInputValue(nextMonth);
    }

    setEndDate(defaultEndDate);
  }, [semesterId, semesters, startDate, hasCustomEndDate]);

  useEffect(() => {
    setHasCustomEndDate(false);
  }, [semesterId]);

  function getFilteredHolidays() {
    if (!startDate || !endDate) return [];
    const start = normalizeCalendarDate(startDate);
    const end = normalizeCalendarDate(endDate);
    return holidays.filter((h) => {
      const hStart = normalizeCalendarDate(h.startDate);
      const hEnd = normalizeCalendarDate(h.endDate);
      return hStart <= end && hEnd >= start;
    });
  }

  function calculate() {
    if (!semesterId || !startDate || !endDate || !currentTotal) return;

    const filteredHolidays = getFilteredHolidays();
    const extraHolArray = extraHolidays.map((h) => ({
      startDate: h.startDate,
      endDate: h.endDate,
    }));
    const extraWorkArray = extraWorkingDays.map((w) => ({
      startDate: w.startDate,
      endDate: w.endDate,
    }));

    const net = calculateNetWorkingDays({
      startDate,
      endDate,
      officialHolidays: filteredHolidays,
      extraHolidays: extraHolArray,
      extraWorkingDays: extraWorkArray,
    });

    const proj = computeProjection({
      currentPresent: Number(currentPresent) || 0,
      currentTotal: Number(currentTotal),
      desiredPercent: Number(desiredPercent),
      netWorkingDays: net.net,
      periodsPerDay: PERIODS_PER_DAY,
    });

    setResult(proj);
  }

  function handleRemoveOfficialHoliday(id) {
    if (!id) return;
    setHolidays((prev) => prev.filter((h) => h._id !== id));
  }

  const filteredHolidays = getFilteredHolidays();
  const hasAttendanceInputs =
    String(currentPresent).trim() !== "" &&
    String(currentTotal).trim() !== "" &&
    String(desiredPercent).trim() !== "";
  const canShowSections = Boolean(startDate && endDate);

  return (
    <AppPageLayout showProfile={false} mainClassName="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-8">
          <AttendanceSection
            showTopBorder={false}
            currentPresent={currentPresent}
            currentTotal={currentTotal}
            desiredPercent={desiredPercent}
            onPresentChange={setCurrentPresent}
            onTotalChange={setCurrentTotal}
            onDesiredPercentChange={setDesiredPercent}
          />

          {hasAttendanceInputs ? (
            <SemesterSection
              semesters={semesters}
              semesterId={semesterId}
              onSemesterChange={setSemesterId}
            />
          ) : (
            <div className="border-t pt-8 text-sm text-slate-500">
              Fill attendance fields first to continue.
            </div>
          )}

          {hasAttendanceInputs && semesterId && (
            <DateRangeSection
              semesters={semesters}
              semesterId={semesterId}
              startDate={startDate}
              endDate={endDate}
              onEndDateChange={(value) => {
                setEndDate(value);
                setHasCustomEndDate(true);
              }}
            />
          )}

          {hasAttendanceInputs && canShowSections && filteredHolidays.length > 0 && (
            <OfficialHolidaysSection
              holidays={filteredHolidays}
              onEditHoliday={(holiday) => {
                setEditingHoliday(holiday);
                setShowHolidayEditModal(true);
              }}
              onRemoveHoliday={handleRemoveOfficialHoliday}
            />
          )}

          {hasAttendanceInputs && canShowSections && (
            <AdjustmentsSection
              extraHolidays={extraHolidays}
              extraWorkingDays={extraWorkingDays}
              onAdd={() => {
                setEditingAdjustment(null);
                setShowModal(true);
              }}
              onEditHoliday={(index, item) => {
                setEditingAdjustment({ index, type: "holiday", ...item });
                setShowModal(true);
              }}
              onEditWorkingDay={(index, item) => {
                setEditingAdjustment({ index, type: "working", ...item });
                setShowModal(true);
              }}
              onRemoveHoliday={(index) =>
                setExtraHolidays((prev) =>
                  prev.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              onRemoveWorkingDay={(index) =>
                setExtraWorkingDays((prev) =>
                  prev.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            />
          )}

          {hasAttendanceInputs && canShowSections && (
            <div className="border-t pt-8">
              <button
                onClick={calculate}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Calculate Projection
              </button>
            </div>
          )}

          <ResultsSection result={result} periodsPerDay={PERIODS_PER_DAY} />
        </div>
      </div>

      <AddExtraModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAdjustment(null);
        }}
        onSubmit={(holidaysFromModal, workingFromModal) => {
          setExtraHolidays(holidaysFromModal);
          setExtraWorkingDays(workingFromModal);
          setShowModal(false);
          setEditingAdjustment(null);
        }}
        editingAdjustment={editingAdjustment}
        currentHolidays={extraHolidays}
        currentWorking={extraWorkingDays}
      />

      <AddHolidayModal
        isOpen={showHolidayEditModal}
        onClose={() => {
          setShowHolidayEditModal(false);
          setEditingHoliday(null);
        }}
        initialData={editingHoliday}
        onSubmit={(payload) => {
          if (!editingHoliday) return;
          setHolidays((prev) =>
            prev.map((h) =>
              h._id === editingHoliday._id ? { ...h, ...payload } : h,
            ),
          );
          setShowHolidayEditModal(false);
          setEditingHoliday(null);
        }}
      />
    </AppPageLayout>
  );
}
