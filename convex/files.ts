import { mutation } from "./_generated/server";

// Generate upload URL for client-side file upload
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
