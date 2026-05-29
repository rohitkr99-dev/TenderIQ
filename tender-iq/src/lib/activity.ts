import prisma from "./prisma";

export async function logActivity({
  userId,
  companyId,
  action,
  entityId,
  entityType,
  metadata,
}: {
  userId: string;
  companyId: string | null;
  action: string;
  entityId?: string;
  entityType?: string;
  metadata?: any;
}) {
  try {
    if (!companyId) {
      console.warn(
        `Activity logging skipped: companyId missing for action ${action}`
      );
      return;
    }

    await prisma.activityLog.create({
      data: {
        userId,
        companyId,
        action,
        entityId,
        entityType,
        metadata: metadata
          ? JSON.parse(JSON.stringify(metadata))
          : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
