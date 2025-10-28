"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getMentorSessions, scheduleSession } from "@/lib/api";
import {
  Clock,
  Plus,
  Video,
  Edit,
  Trash2,
  Lock,
} from "lucide-react";
import { format, addHours, parse } from "date-fns";

interface Session {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  topic: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number;
  status:
    | "scheduled"
    | "completed"
    | "cancelled"
    | "accepted"
    | "pending"
    | "rejected";
  type: "virtual" | "in_person";
  location?: string;
  meetingLink?: string;
  meetingId?: string;
  passcode?: string;
  notes?: string;
}

/* ---------- BentoCard (no external link needed) ---------- */
interface BentoCardProps {
  children: React.ReactNode;
  height?: string;
  rowSpan?: number;
  colSpan?: number;
  className?: string;
  showHoverGradient?: boolean;
  hideOverflow?: boolean;
}

function BentoCard({
  children,
  height = "h-auto",
  rowSpan = 8,
  colSpan = 7,
  className = "",
  showHoverGradient = true,
  hideOverflow = true,
}: BentoCardProps) {
  const cardContent = (
    <div
      className={`group relative flex flex-col rounded-2xl border border-border-primary bg-bg-primary p-6 hover:bg-indigo-100/10 dark:hover:bg-indigo-900/10 ${
        hideOverflow && "overflow-hidden"
      } ${height} row-span-${rowSpan} col-span-${colSpan} ${className}`}
    >
      {showHoverGradient && (
        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tl from-indigo-400/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></div>
      )}
      {children}
    </div>
  );

  return cardContent;
}

/* ---------- Calendar Day ---------- */
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface CalendarDayProps {
  day: number | string;
  isHeader?: boolean;
  hasSession?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isHeader,
  hasSession,
  isSelected,
  onClick,
}) => {
  const base = `col-span-1 row-span-1 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-medium cursor-pointer transition-all`;

  if (isHeader) {
    return (
      <div className={`${base} text-xs text-text-tertiary`}>{day}</div>
    );
  }

  const bg = hasSession
    ? "bg-indigo-500 text-white"
    : isSelected
    ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500"
    : "hover:bg-gray-100 text-text-tertiary";

  return (
    <div className={`${base} ${bg}`} onClick={onClick}>
      {day}
    </div>
  );
};

/* ---------- Custom Calendar ---------- */
interface CustomCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  sessions: Session[];
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onSelectDate,
  sessions,
}) => {
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sessionSet = new Set(sessions.map((s) => s.date));

  const handleClick = (day: number) => {
    onSelectDate(new Date(year, month, day));
  };

  const renderDays = () => {
    const items: React.ReactNode[] = [
      ...dayNames.map((d) => (
        <CalendarDay key={`h-${d}`} day={d} isHeader />
      )),
      ...Array.from({ length: firstDay }).map((_, i) => (
        <div key={`e-${i}`} className="col-span-1 row-span-1 h-8 w-8" />
      )),
      ...Array.from({ length: daysInMonth }).map((_, i) => {
        const d = i + 1;
        const dateStr = format(new Date(year, month, d), "yyyy-MM-dd");
        const has = sessionSet.has(dateStr);
        const sel = format(selectedDate, "yyyy-MM-dd") === dateStr;
        return (
          <CalendarDay
            key={`d-${d}`}
            day={d}
            hasSession={has}
            isSelected={sel}
            onClick={() => handleClick(d)}
          />
        );
      }),
    ];
    return items;
  };

  return (
    <div className="h-full w-full rounded-[24px] border border-border-primary p-2 transition-colors duration-100 group-hover:border-indigo-400">
      <div
        className="h-full rounded-2xl border-2 border-[#A5AEB81F]/10 p-3"
        style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}
      >
        <div className="flex items-center justify-between mb-3 px-2">
          <p className="text-sm font-medium">
            {format(selectedDate, "MMMM yyyy")}
          </p>
          <p className="text-xs text-text-tertiary">30 min call</p>
        </div>
        <div className="grid grid-cols-7 grid-rows-6 gap-2 px-2">
          {renderDays()}
        </div>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
export default function MentorCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [acceptedBookings, setAcceptedBookings] = useState<any[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [scheduleForm, setScheduleForm] = useState({
    bookingId: 0,
    scheduledDate: "",
    scheduledTime: "",
    meetingLink: "",
    meetingId: "",
    passcode: "",
  });

  /* ----- fetch data ----- */
  const fetchData = async () => {
    const mentorId = parseInt(
      localStorage.getItem("mentorId") || "5",
      10
    );
    try {
      const resp = await getMentorSessions(mentorId);
      const mapped: Session[] = resp.data.map((b: any) => {
        const dt = b.scheduled_date_time || b.preferred_date_time;
        const date = dt ? dt.split("T")[0] : new Date().toISOString().split("T")[0];
        const start = dt ? dt.split("T")[1].substring(0, 5) : "00:00";
        const startDt = parse(`${date} ${start}`, "yyyy-MM-dd HH:mm", new Date());
        const endDt = addHours(startDt, 1);
        const end = format(endDt, "HH:mm");

        return {
          id: b.id.toString(),
          menteeId: b.student_id.toString(),
          menteeName: b.student_name || "Unknown Student",
          menteeAvatar: "/api/placeholder/40/40",
          topic: b.topic,
          date,
          startTime: start,
          endTime: end,
          duration: 60,
          status: b.status as Session["status"],
          type: "virtual" as const,
          location: b.location,
          meetingLink: b.meeting_link,
          meetingId: b.meeting_id,
          passcode: b.passcode,
          notes: b.message,
        };
      });
      setSessions(mapped);
      setAcceptedBookings(
        resp.data.filter((b: any) => b.status === "accepted")
      );
    } catch (e) {
      console.error("fetch error:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ----- helpers ----- */
  const sessionsForDate = (d: Date) =>
    sessions.filter((s) => s.date === format(d, "yyyy-MM-dd"));

  const selectedSessions = sessionsForDate(selectedDate);

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      accepted: "bg-purple-100 text-purple-800 border-purple-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return map[s] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  /* ----- schedule ----- */
  const handleSchedule = async () => {
    if (!scheduleForm.bookingId || !scheduleForm.scheduledDate || !scheduleForm.scheduledTime) {
      alert("Fill all required fields");
      return;
    }
    try {
      const dt = `${scheduleForm.scheduledDate}T${scheduleForm.scheduledTime}:00Z`;
      await scheduleSession(scheduleForm.bookingId, {
        scheduled_date_time: dt,
        meeting_link: scheduleForm.meetingLink || null,
        meeting_id: scheduleForm.meetingId || null,
        passcode: scheduleForm.passcode || null,
      });
      await fetchData();
      setShowScheduleDialog(false);
      setScheduleForm({
        bookingId: 0,
        scheduledDate: "",
        scheduledTime: "",
        meetingLink: "",
        meetingId: "",
        passcode: "",
      });
      alert("Session scheduled!");
    } catch (e: any) {
      alert(e.response?.data?.error || e.message || "Failed");
    }
  };

  /* ----- navigation ----- */
  const prevMonth = () => {
    const p = new Date(selectedDate);
    p.setMonth(p.getMonth() - 1);
    setSelectedDate(p);
  };
  const nextMonth = () => {
    const n = new Date(selectedDate);
    n.setMonth(n.getMonth() + 1);
    setSelectedDate(n);
  };
  const today = () => setSelectedDate(new Date());

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-white text-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-gray-600 mt-1">
            Manage your mentoring schedule and appointments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={view}
            onValueChange={(v: any) => setView(v)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowScheduleDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <BentoCard height="h-auto" className="p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {format(selectedDate, "MMMM yyyy")}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    ←
                  </Button>
                  <Button variant="outline" size="sm" onClick={today}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    →
                  </Button>
                </div>
              </div>
              <CustomCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                sessions={sessions}
              />
            </div>
          </BentoCard>
        </div>

        {/* Selected date sessions */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                {format(selectedDate, "EEEE, MMMM d")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSessions.length > 0 ? (
                <div className="space-y-4">
                  {selectedSessions.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={s.menteeAvatar} />
                            <AvatarFallback className="bg-gray-600 text-white text-xs">
                              {s.menteeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">
                              {s.topic}
                            </h4>
                            <p className="text-xs text-gray-600">
                              with {s.menteeName}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={statusColor(s.status)}
                        >
                          {s.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-2" />
                          {s.startTime} - {s.endTime}
                        </div>
                        {s.meetingId && (
                          <div className="flex items-center">
                            <Video className="w-3 h-3 mr-2" />
                            ID: {s.meetingId}
                          </div>
                        )}
                        {s.passcode && (
                          <div className="flex items-center">
                            <Lock className="w-3 h-3 mr-2" />
                            Pass: {s.passcode}
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-3">
                        {s.status === "scheduled" && s.meetingLink && (
                          <a
                            href={s.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Join
                          </a>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-200 border-2 border-dashed rounded-xl mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No sessions scheduled
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setShowScheduleDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total Sessions
                </span>
                <span className="font-semibold">{sessions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Completed
                </span>
                <span className="font-semibold text-green-600">
                  {sessions.filter((s) => s.status === "completed").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Scheduled
                </span>
                <span className="font-semibold text-blue-600">
                  {sessions.filter((s) => s.status === "scheduled").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <Select
                value={
                  scheduleForm.bookingId === 0
                    ? ""
                    : scheduleForm.bookingId.toString()
                }
                onValueChange={(v) =>
                  setScheduleForm((p) => ({
                    ...p,
                    bookingId: parseInt(v),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {acceptedBookings.map((r: any) => (
                    <SelectItem
                      key={r.id}
                      value={r.id.toString()}
                    >
                      {r.student_name || "Unknown Student"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <Input
                type="date"
                value={scheduleForm.scheduledDate}
                onChange={(e) =>
                  setScheduleForm((p) => ({
                    ...p,
                    scheduledDate: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <Input
                type="time"
                value={scheduleForm.scheduledTime}
                onChange={(e) =>
                  setScheduleForm((p) => ({
                    ...p,
                    scheduledTime: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link (optional)
              </label>
              <Input
                type="url"
                placeholder="https://zoom.us/..."
                value={scheduleForm.meetingLink}
                onChange={(e) =>
                  setScheduleForm((p) => ({
                    ...p,
                    meetingLink: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting ID (optional)
              </label>
              <Input
                placeholder="123 456 7890"
                value={scheduleForm.meetingId}
                onChange={(e) =>
                  setScheduleForm((p) => ({
                    ...p,
                    meetingId: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passcode (optional)
              </label>
              <Input
                placeholder="Passcode"
                value={scheduleForm.passcode}
                onChange={(e) =>
                  setScheduleForm((p) => ({
                    ...p,
                    passcode: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowScheduleDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSchedule}
              >
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}