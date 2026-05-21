-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentName" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "childName" VARCHAR(120) NOT NULL,
    "age" INTEGER NOT NULL,
    "school" VARCHAR(200) NOT NULL,
    "series" VARCHAR(200) NOT NULL,
    "ageCategory" VARCHAR(32) NOT NULL,
    "medicalInfo" TEXT NOT NULL,
    "childPassions" TEXT NOT NULL,
    "organizerNotes" TEXT NOT NULL,
    "gdprAccepted" BOOLEAN NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationRecipient" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationRecipient_email_key" ON "NotificationRecipient"("email");
