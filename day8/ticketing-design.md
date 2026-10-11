# TicketHub System Design

## 1. Requirements
* **Functional:** Users must be able to browse upcoming events, view available seats, place a temporary hold on specific seats, complete a payment, and view their purchased tickets.
* **Non-Functional:** The system must strictly enforce ACID consistency (zero double-bookings allowed). It must also be highly available and capable of absorbing massive, sudden traffic spikes without crashing (fairness and speed).

## 2. Capacity & Traffic Estimates
* **Normal Traffic:** 
  * *Reads:* 50,000 users × 10 pages = 500,000 page views / day (~6 requests per second).
  * *Writes:* 5,000 tickets sold / day (~0.06 writes per second).
* **Peak Traffic (The "Big Sale"):** 
  * 200,000 users attempting actions within 10 minutes (600 seconds). 
  * This translates to over 333 users hitting the site *every second*. 
  * Attempting to lock 20,000 seats in 600 seconds generates ~33 successful writes per second, plus thousands of rejected write attempts. 
  * **Comparison:** Peak traffic forces the system to handle over 50× its normal read/write volume instantly.

## 3. REST API Endpoints
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/events` | Lists upcoming concerts and events. |
| `GET` | `/api/events/:id/seats` | Returns the seat map and availability for a specific event. |
| `POST` | `/api/seats/hold` | Places a temporary 5-minute lock on a seat for checkout. |
| `POST` | `/api/orders` | Processes payment and finalizes the ticket purchase. |
| `GET` | `/api/users/tickets` | Retrieves the authenticated user's purchased tickets. |

## 4. Data Model
* **users:** `id` (PK), `email`, `password_hash`, `created_at`
* **events:** `id` (PK), `name`, `date`, `venue`, `total_seats`
* **seats:** `id` (PK), `event_id` (FK), `seat_number`, `status` (Available, Held, Sold)
* **orders:** `id` (PK), `user_id` (FK), `event_id` (FK), `seat_id` (FK), `total_price`, `status`

## 5. Preventing Double-Booking (Concurrency Control)
To prevent two users from buying the exact same seat simultaneously, the system uses **Database Transactions** with **Row-Level Locking** (`SELECT ... FOR UPDATE`). 
When User A selects Seat 1, the database locks that specific row in the `seats` table. If User B tries to select Seat 1 a millisecond later, their database query is forced to wait until User A completes their transaction (either buying it, or letting the 5-minute hold expire). Additionally, we place a `UNIQUE` constraint on the combination of `(event_id, seat_number)` associated with a "Sold" status, ensuring the database physically rejects any duplicate purchase records.

## 6. Architecture & Surviving the Peak
```text
[ Users ] ---> [ CDN ] ---> [ Load Balancer ]
                                 |
      +--------------------------+--------------------------+
      |                          |                          |
[ App Server 1 ]           [ App Server 2 ]         [ App Server 3 ]
      |                          |                          |
      +---------------+----------+----------+---------------+
                      |                     |
               [ Redis Cache ]     [ Message Queue ] ---> [ Email/PDF Worker ]
               (Seat Maps)                  |
                      |                     v
             +-----------------------------------+
             |                                   |
    [ Primary Database ] <------Sync-----> [ Read Replica ]
    (Handles Locks/Purchases)              (Handles Browsing)