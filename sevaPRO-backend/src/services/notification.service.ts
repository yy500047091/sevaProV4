export function pushNotification(userId: string, title: string, body: string) {
  console.log(`[notification:${userId}] ${title}: ${body}`);
}
