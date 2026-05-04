export function formatIban(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export function formatIbanForDisplay(value: string): string {
  return formatIban(value).replace(/(.{4})(?=.)/g, "$1 ");
}
