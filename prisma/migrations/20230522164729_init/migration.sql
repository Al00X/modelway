-- CreateTable
CREATE TABLE "Model" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "vaePath" TEXT,
    "thumbnailPath" TEXT,
    "infoPath" TEXT,
    "configPath" TEXT,
    "hide" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "ModelMetadata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "serverId" INTEGER,
    "name" TEXT,
    "notes" TEXT,
    "description" TEXT,
    "nsfw" BOOLEAN,
    "creator" TEXT,
    "originalValues" TEXT,
    "modelId" INTEGER NOT NULL,
    CONSTRAINT "ModelMetadata_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModelVersion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverId" INTEGER,
    "fileName" TEXT,
    "baseModel" TEXT,
    "name" TEXT,
    "description" TEXT,
    "createdAt" DATETIME,
    "updatedAt" DATETIME,
    "metadataId" INTEGER NOT NULL,
    "metadataCurrentVersionId" INTEGER,
    CONSTRAINT "ModelVersion_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "ModelMetadata" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ModelVersion_metadataCurrentVersionId_fkey" FOREIGN KEY ("metadataCurrentVersionId") REFERENCES "ModelMetadata" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModelImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "nsfw" BOOLEAN,
    "order" INTEGER,
    "hide" BOOLEAN,
    "hash" TEXT,
    "versionId" INTEGER NOT NULL,
    "metadataCoverImageId" INTEGER,
    CONSTRAINT "ModelImage_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "ModelVersion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ModelImage_metadataCoverImageId_fkey" FOREIGN KEY ("metadataCoverImageId") REFERENCES "ModelMetadata" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModelImageMetadata" (
    "imageId" TEXT NOT NULL PRIMARY KEY,
    "seed" BIGINT,
    "steps" INTEGER,
    "prompt" TEXT,
    "sampler" TEXT,
    "cfgScale" INTEGER,
    "hash" TEXT,
    "negativePrompt" TEXT,
    CONSTRAINT "ModelImageMetadata_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "ModelImage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CivitFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sizeKB" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "pickleScanResult" TEXT NOT NULL,
    "pickleScanMessage" TEXT NOT NULL,
    "virusScanResult" TEXT NOT NULL,
    "scannedAt" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "versionId" INTEGER NOT NULL,
    CONSTRAINT "CivitFile_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "ModelVersion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CivitFileHashes" (
    "fileId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "SHA256" TEXT,
    "AutoV1" TEXT,
    "AutoV2" TEXT,
    "BLAKE3" TEXT,
    "CRC32" TEXT,
    CONSTRAINT "CivitFileHashes_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "CivitFile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "isLocal" BOOLEAN,
    "isDeleted" BOOLEAN
);

-- CreateTable
CREATE TABLE "ModelNameTag" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "isLocal" BOOLEAN,
    "isDeleted" BOOLEAN
);

-- CreateTable
CREATE TABLE "Trigger" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "isLocal" BOOLEAN,
    "isDeleted" BOOLEAN
);

-- CreateTable
CREATE TABLE "_ModelMetadataToTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ModelMetadataToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "ModelMetadata" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ModelMetadataToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ModelVersionToTrigger" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ModelVersionToTrigger_A_fkey" FOREIGN KEY ("A") REFERENCES "ModelVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ModelVersionToTrigger_B_fkey" FOREIGN KEY ("B") REFERENCES "Trigger" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ModelNameTagToModelVersion" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ModelNameTagToModelVersion_A_fkey" FOREIGN KEY ("A") REFERENCES "ModelNameTag" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ModelNameTagToModelVersion_B_fkey" FOREIGN KEY ("B") REFERENCES "ModelVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_path_key" ON "Model"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Model_filename_key" ON "Model"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "ModelMetadata_serverId_key" ON "ModelMetadata"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelMetadata_modelId_key" ON "ModelMetadata"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelVersion_serverId_key" ON "ModelVersion"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelVersion_metadataCurrentVersionId_key" ON "ModelVersion"("metadataCurrentVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelImage_metadataCoverImageId_key" ON "ModelImage"("metadataCoverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelImageMetadata_imageId_key" ON "ModelImageMetadata"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "CivitFile_versionId_key" ON "CivitFile"("versionId");

-- CreateIndex
CREATE UNIQUE INDEX "CivitFileHashes_fileId_key" ON "CivitFileHashes"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "_ModelMetadataToTag_AB_unique" ON "_ModelMetadataToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ModelMetadataToTag_B_index" ON "_ModelMetadataToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ModelVersionToTrigger_AB_unique" ON "_ModelVersionToTrigger"("A", "B");

-- CreateIndex
CREATE INDEX "_ModelVersionToTrigger_B_index" ON "_ModelVersionToTrigger"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ModelNameTagToModelVersion_AB_unique" ON "_ModelNameTagToModelVersion"("A", "B");

-- CreateIndex
CREATE INDEX "_ModelNameTagToModelVersion_B_index" ON "_ModelNameTagToModelVersion"("B");
