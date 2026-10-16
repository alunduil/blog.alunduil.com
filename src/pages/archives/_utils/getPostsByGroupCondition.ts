import type { Entry } from "@/utils/entries";

type GroupKey = string | number | symbol;
type GroupFunction<T> = (item: T, index?: number) => GroupKey;

export function getPostsByGroupCondition(
  posts: Entry[],
  groupFunction: GroupFunction<Entry>
) {
  const result: Record<GroupKey, Entry[]> = {};

  for (let i = 0; i < posts.length; i++) {
    const item = posts[i];
    const groupKey = groupFunction(item, i);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
  }

  return result;
}
