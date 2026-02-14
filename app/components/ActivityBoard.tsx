import { ActivityEvent } from "../lib/types";
import { useTheme } from "next-themes";
import { themes } from "../lib/themes";

interface ActivityBoardProps {
  events: ActivityEvent[];
}

export function ActivityBoard({ events }: ActivityBoardProps) {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? themes.dark : themes.light;

  return (
    <div
      className="fixed right-4 top-20 w-64 max-h-96 rounded-lg border shadow-lg overflow-hidden flex flex-col"
      style={{
        background: currentTheme.gridBackground,
        borderColor: currentTheme.cellBorder,
      }}
    >
      <div
        className="px-4 py-2 font-semibold text-sm"
        style={{ borderBottom: `1px solid ${currentTheme.cellBorder}` }}
      >
        Activity
      </div>
      <div className="overflow-y-auto flex-1 divide-y" style={{ borderColor: currentTheme.cellBorder }}>
        {events.length === 0 ? (
          <div className="px-4 py-3 text-xs text-gray-500">No activity yet</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="px-4 py-2 text-xs">
              <div className="font-medium">{event.userEmail}</div>
              <div className="text-gray-400">
                {event.action === "booked" ? "🟩 Booked" : "📤 Sold"} block {event.blockId}
              </div>
              <div className="text-gray-500 text-[10px] mt-1">
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}