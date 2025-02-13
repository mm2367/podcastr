import { v } from "convex/values";
import { mutation } from "./_generated/server";

//@ts-ignore
export const generateUploadUrl = mutation({
    args: {
    },
    handler: async (ctx, args) => {
        return await ctx.storage.generateUploadUrl();
    },
});
