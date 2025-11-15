import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface Event {
  title: string;
  from: Date;
  to: Date;
}

const mockEvents: Event[] = [
  {
    title: "Mock Event 1",
    from: new Date(2024, 5, 10, 9, 0),
    to: new Date(2024, 5, 10, 10, 0),
  },
  {
    title: "Mock Event 2",
    from: new Date(2024, 5, 12, 14, 30),
    to: new Date(2024, 5, 12, 15, 30),
  },
  {
    title: "Mock Event 3",
    from: new Date(2024, 5, 15, 11, 0),
    to: new Date(2024, 5, 15, 12, 0),
  },
];

function formatDateRange(from: Date, to: Date) {
  return `${from.toLocaleDateString()} ${from.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function CalendarModal({ events = mockEvents, open, onOpenChange }: { events?: Event[]; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    if (events.length > 0) {
      setSelectedDate(events[0].from);
    }
  }, [events]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Upcoming Events Calendar</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="bg-transparent p-0"
            required
            modifiers={{
              event: events.map(event => event.from),
            }}
            modifiersClassNames={{
              event: "event-day",
            }}
          />
          <div className="flex-1 space-y-2 max-h-60 overflow-y-auto">
            {events.map((event) => (
              <div key={event.title} className="p-2 border rounded-md bg-gray-50">
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-gray-600">{formatDateRange(event.from, event.to)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
