export function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Environment Variable ${name} is missing`
    );
  }

  return value;
}