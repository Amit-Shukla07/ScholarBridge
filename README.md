# ScholarBridge MCP Server

## 1. The Problem
University students suffer from campus information fragmentation. Schedules, attendance records, mess menus, and assignment deadlines are scattered across multiple platforms (Moodle, ERPs, Notion, Google Classroom). Furthermore, tracking the strict 75% attendance rule often leads to "debarment anxiety" due to manual tracking errors and miscalculations.

## 2. Architecture
ScholarBridge is a local Academic Intelligence MCP (Model Context Protocol) Server. 
Why MCP over ad-hoc chatbots?
- **Universal Client Compatibility**: Works out-of-the-box with Claude Desktop, Cursor, and any other MCP-compatible clients.
- **Local Privacy**: Your academic data, OAuth tokens, and schedules never leave your machine except when bridging directly to Google via APIs.
- **Zero Subscription Lock-in**: Run it completely locally, free of charge.

The architecture is layered:
- **Types/Data**: Defined in TypeScript and strictly validated via Zod.
- **Services**: Business logic that handles safe bunk calculations, multi-day menu rotations, and Google OAuth flow.
- **Tools**: MCP bindings that expose service functions to LLMs.
- **Server**: Exposes the standard JSON-RPC over `stdio`.

## 3. Tool Reference
- `check_attendance_status`: Evaluates attendance for a course (or all courses), returning your current percentage, safe bunks allowed, or consecutive classes needed to avoid debarment.
- `get_enrolled_courses`: Retrieves a list of all your enrolled courses along with instructor and venue details.
- `lookup_course`: Looks up detailed schedule and room allocation for a specific course code.
- `get_dining_menu`: Fetches the hostel mess menu for a given day and mess type ('north' or 'south'), with optional meal slot filtering (breakfast, lunch, snacks, dinner).
- `show_todays_menu`: Automatically detects today's day of the week and returns the complete breakfast, lunch, snacks, and dinner schedule for North or South mess with service timings.
- `get_mess_timings`: Returns the full reference table for operational mess timings across weekdays and weekends.
- `get_pending_deadlines`: Returns all upcoming assignments, dates, and the required submission portals.

## 4. Setup Guide

### Local Setup
1. Clone this directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the TypeScript code:
   ```bash
   npm run build
   ```
4. Run in dev mode (using `tsx`):
   ```bash
   npm run dev
   ```

### Claude Desktop Integration
Add the following snippet to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "scholarbridge": {
      "command": "node",
      "args": [
        "/absolute/path/to/scholarbridge/dist/index.js"
      ]
    }
  }
}
```

## 5. Extensibility (Google Workspace)
To integrate Google Classroom and Calendar:
1. Copy `.env.example` to `.env`.
2. Provide your `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.
3. The `google.service.ts` stub provides the OAuth flow outline and prepares the server for live two-way sync.
