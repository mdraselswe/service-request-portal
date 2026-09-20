-- Add a sortable business rank while preserving the display value.
ALTER TABLE "ServiceRequest" ADD COLUMN "priorityRank" INTEGER NOT NULL DEFAULT 2;

UPDATE "ServiceRequest"
SET "priorityRank" = CASE "priority"
    WHEN 'LOW' THEN 1
    WHEN 'MEDIUM' THEN 2
    WHEN 'HIGH' THEN 3
    WHEN 'URGENT' THEN 4
    ELSE 0
END;

CREATE INDEX "ServiceRequest_priorityRank_updatedAt_idx"
ON "ServiceRequest"("priorityRank", "updatedAt");
