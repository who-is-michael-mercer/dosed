import { z } from 'zod';
export const stableIdSchema = z.string().regex(/^[a-z]+(?:\.[a-z0-9][a-z0-9-]*)+$/);
export type StableId = z.infer<typeof stableIdSchema>;
export const prioritySchema = z.enum(['critical', 'important', 'context']);
export const reviewSchema = z.object({ status: z.enum(['draft','needs_clinical_review','reviewed']), reviewedAt:z.string(), reviewDue:z.string() });
const sourced=z.object({sourceIds:z.array(stableIdSchema).min(1)});
export const safetyClaimSchema=sourced.extend({id:stableIdSchema,priority:prioritySchema,title:z.string().min(1),body:z.string().min(1),action:z.string().min(1)});
export const substanceSchema=sourced.extend({id:stableIdSchema,name:z.string().min(1),aliases:z.array(z.object({text:z.string(),kind:z.string(),display:z.boolean()})),searchTerms:z.array(z.string()),categoryIds:z.array(stableIdSchema).min(1),visual:z.object({symbol:z.string(),color:z.string()}),identity:z.string().min(1),review:reviewSchema,safetyClaims:z.array(safetyClaimSchema),doseReferences:z.array(z.unknown()).optional(),timelines:z.array(z.unknown()).optional(),effects:z.any().optional(),testing:z.any().optional(),helpSigns:z.array(z.string()).optional(),relationships:z.array(z.object({substanceId:stableIdSchema,reason:z.string()})).optional(),rabbitHole:z.array(z.unknown()).optional()});
export type Substance=z.infer<typeof substanceSchema>;
export interface ContentRepository { listSubstances(): readonly Substance[]; getSubstance(id:StableId):Substance|undefined; }
export interface RecentEntry { substanceId: StableId; viewedAt: number }
export interface RecentRepository { list():Promise<readonly RecentEntry[]>; record(entry:RecentEntry):Promise<void>; clear():Promise<void> }
