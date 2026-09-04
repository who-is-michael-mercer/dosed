import AsyncStorage from '@react-native-async-storage/async-storage';
import { stableIdSchema, type RecentEntry, type RecentRepository } from '../../domain/content';
export interface KeyValueStorage {getItem(key:string):Promise<string|null>;setItem(key:string,value:string):Promise<void>;removeItem(key:string):Promise<void>}
const KEY='dosed.recent.v1'; export const RECENT_LIMIT=12;
export class OnDeviceRecentlyViewedRepository implements RecentRepository {
 constructor(private readonly storage:KeyValueStorage=AsyncStorage){}
 async list():Promise<readonly RecentEntry[]>{try{const raw=await this.storage.getItem(KEY);if(!raw)return[];const parsed:unknown=JSON.parse(raw);if(!Array.isArray(parsed))return[];return parsed.filter((x):x is RecentEntry=>Boolean(x)&&typeof x==='object'&&stableIdSchema.safeParse((x as RecentEntry).substanceId).success&&Number.isFinite((x as RecentEntry).viewedAt)).sort((a,b)=>b.viewedAt-a.viewedAt).slice(0,RECENT_LIMIT)}catch{return[]}}
 async record(entry:RecentEntry){const current=await this.list();const next=[entry,...current.filter(x=>x.substanceId!==entry.substanceId)].sort((a,b)=>b.viewedAt-a.viewedAt).slice(0,RECENT_LIMIT);await this.storage.setItem(KEY,JSON.stringify(next))}
 async clear(){await this.storage.removeItem(KEY)}
}
export const recentRepository=new OnDeviceRecentlyViewedRepository();
