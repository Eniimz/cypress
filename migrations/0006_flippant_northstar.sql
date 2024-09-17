ALTER TABLE "collaborators" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "created_at" SET NOT NULL;