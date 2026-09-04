import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '../..');
export const readJson = file => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
export const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
export const compact = value => normalize(value).replaceAll(' ', '');
export const distance = (a, b) => {
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i=1;i<=a.length;i++) { let previous=row[0]; row[0]=i; for(let j=1;j<=b.length;j++){const old=row[j]; row[j]=Math.min(row[j]+1,row[j-1]+1,previous+(a[i-1]===b[j-1]?0:1)); previous=old;} }
  return row[b.length];
};
export function loadContent() {
 const categories=readJson('content/taxonomy/categories.json');
 const sources=readJson('content/sources/sources.json');
 const emergency=readJson('content/emergency/core.json');
 const substances=fs.readdirSync(path.join(ROOT,'content/substances')).sort().map(file=>readJson(`content/substances/${file}`));
 return {categories,sources,emergency,substances};
}
const idPattern=/^[a-z]+(?:\.[a-z0-9][a-z0-9-]*)+$/;
export function validateContent(content=loadContent()) {
 const errors=[]; const ids=new Set(); const add=(ok,msg)=>{if(!ok)errors.push(msg)};
 const all=[...content.categories,...content.sources,...content.substances,content.emergency];
 for(const item of all){add(typeof item.id==='string'&&idPattern.test(item.id),`invalid ID: ${item.id}`);add(!ids.has(item.id),`duplicate ID: ${item.id}`);ids.add(item.id)}
 const categoryIds=new Set(content.categories.map(x=>x.id)); const sourceIds=new Set(content.sources.map(x=>x.id)); const substanceIds=new Set(content.substances.map(x=>x.id));
 const aliases=new Map();
 for(const s of content.substances){
   add(s.review?.status&&s.review?.reviewedAt&&s.review?.reviewDue,`${s.id}: missing review metadata`);
   add(Array.isArray(s.sourceIds)&&s.sourceIds.length>0,`${s.id}: missing required sources`);
   for(const id of s.categoryIds??[])add(categoryIds.has(id),`${s.id}: broken category ${id}`);
   for(const id of s.sourceIds??[])add(sourceIds.has(id),`${s.id}: broken source ${id}`);
   for(const alias of s.aliases??[]){const key=normalize(alias.text); const list=aliases.get(key)??[];list.push(s.id);aliases.set(key,list)}
   for(const claim of s.safetyClaims??[]){add(['critical','important','context'].includes(claim.priority),`${claim.id}: invalid safety priority`);add(Boolean(claim.action),`${claim.id}: missing linked action`);for(const id of claim.sourceIds??[])add(sourceIds.has(id),`${claim.id}: broken source ${id}`)}
   for(const dose of s.doseReferences??[]){for(const range of dose.ranges??[])add(Number.isFinite(range.min)&&Number.isFinite(range.max)&&range.min<range.max,`${dose.id}: invalid dose range`);add(['oral','insufflated'].includes(dose.route),`${dose.id}: invalid route`);add((dose.sourceIds??[]).length>0,`${dose.id}: missing source`)}
   for(const relation of s.relationships??[])add(substanceIds.has(relation.substanceId),`${s.id}: broken relationship ${relation.substanceId}`);
 }
 add((content.emergency.expected?.length??0)>0&&content.emergency.payAttention?.length>0&&content.emergency.getHelp?.length>0,'missing core emergency content');
 return {errors,ambiguousAliases:[...aliases].filter(([,v])=>new Set(v).size>1).map(([alias,substanceIds])=>({alias,substanceIds:[...new Set(substanceIds)].sort()}))};
}
export function buildSearchIndex(substances){return substances.flatMap(s=>[
 {substanceId:s.id,term:normalize(s.name),compact:compact(s.name),kind:'name',weight:100},
 ...(s.aliases??[]).map(a=>({substanceId:s.id,term:normalize(a.text),compact:compact(a.text),kind:'alias',weight:80})),
 ...(s.searchTerms??[]).map(term=>({substanceId:s.id,term:normalize(term),compact:compact(term),kind:'curated',weight:60}))
]).sort((a,b)=>a.term.localeCompare(b.term)||a.substanceId.localeCompare(b.substanceId)||b.weight-a.weight)}
export function search(index, substances, query){const q=normalize(query),qc=compact(query); if(!q)return[]; const scores=new Map(); for(const item of index){let score=0;if(item.term===q||item.compact===qc)score=item.weight+100;else if(item.term.startsWith(q)||item.compact.startsWith(qc))score=item.weight+60-q.length;else {const d=distance(qc,item.compact);const bound=qc.length>=5?2:1;if(d<=bound)score=item.weight+30-d*10}if(score>0)scores.set(item.substanceId,Math.max(scores.get(item.substanceId)??0,score));}return [...scores].map(([id,score])=>({substance:substances.find(s=>s.id===id),score})).filter(x=>x.substance).sort((a,b)=>b.score-a.score||a.substance.name.localeCompare(b.substance.name));}
