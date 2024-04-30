import { useMemo } from "react";

export type Rule = { condition: (str: string) => boolean; text: string };

export type RuleType<K> = { [key in keyof K]?: Array<Rule> };

export const ruleFactory = <T extends Record<string, any>>(...keys: Array<keyof T>) =>
  keys.reduce<RuleType<T>>((acc, key) => ({ ...acc, [key]: [] }), {});

export const addRule = <T extends Record<string, any>>(
  rules: RuleType<T>,
  key: keyof T,
  condition: (str: string) => boolean,
  text: string
) => {
  if (!rules[key]) rules[key] = [];
  rules[key]?.push({ condition, text });
  return rules;
};

export const useRules = <T extends Record<string, any>>(rules: RuleType<T>, formData: T) => {
  const validity = useMemo(
    () =>
      Object.keys(rules).every((key) => formData[key].length > 0) &&
      Object.entries(rules).every(([key, rule]) =>
        rule ? rule.every((r) => r.condition(formData[key])) : true
      ),
    [formData, rules]
  );
  const errorMessages = useMemo(
    () =>
      Object.entries(rules).flatMap(([key, rule]) =>
        rule
          ? rule.filter((r) => !r.condition(formData[key]) && formData[key].length > 0).map((r) => r.text)
          : []
      ),
    [formData, rules]
  );
  return { validity, errorMessages };
};
