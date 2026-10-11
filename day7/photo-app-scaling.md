# SnapShare Scaling Plan

## 1. Assumptions & Baseline Metrics
* **Registered Users:** 10,000,000
* **Daily Active Users (DAU):** 1,000,000 (10% of total)
* **Uploads:** 1 photo per DAU per day = 1,000,000 uploads/day
* **Feed Views:** 50 pages per DAU per day = 50,000,000 views/day
* **File Sizes:** Average photo is 2 MB; thumbnail is 50 KB (Total: 2.05 MB per upload)
* **Peak Traffic:** Assumed to be 5× the average rate.

## 2. Capacity Estimates
* **Uploads per second:** ~12 req/sec (Average: 1M / 86,400s). Peak: ~60 req/sec.
* **Feed views per second:** ~580 req/sec (Average: 50M / 86,400s). Peak: ~2,900 req/sec.
* **Storage per year:** 1 million uploads × 2.05 MB = 2.05 TB per day. 2.05 TB × 365 days = **~748 TB per year**.

## 3. System Load Profile
This system is heavily **read-heavy**. With roughly 580 feed views per second compared to just 12 uploads per second, the read-to-write ratio is nearly 50:1. For our design, this means we must aggressively optimize for reading data by utilizing caching, Content Delivery Networks (CDNs), and database read replicas to prevent the system from bogging down under read pressure.

## 4. Photo Storage Strategy
Photos should **not** be stored directly inside the relational database. Storing large binary files (BLOBs) inside a database bloats its size, drastically slows down queries and backups, and is significantly more expensive than specialized file storage. Instead, the actual image files should be stored in a cloud **Object Storage** service (like Amazon S3), while the database only stores the URL link to that object's location.

## 5. Architecture Diagram
```text
[Users / Mobile Clients]
       |
       v
   [ CDN ] --------> (Serves cached photos/thumbnails from Edge locations)
       |
       v
[ Load Balancer ]
       |
       +-----------------------+
       |                       |
[ App Server 1 ]        [ App Server 2 ]
       |                       |
       +-----------+-----------+
                   |
+---------------------------------------------+
|                  |                          |
v                  v                          v
[ Cache ]     [ Message Queue ] ---> [ Worker Node(s) ]
(Redis)       (Thumbnail Jobs)       (Generates thumbnails)
                   |
                   v
+---------------------------------------------+
|                                             |
v                                             v
[ Primary Database ] <---Sync---> [ Database Read Replica ]
(Handles Writes/Uploads)          (Handles Feed Reads)
|
v
[ Object Storage ] (AWS S3 - holds 2MB & 50KB files)