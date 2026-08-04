import bcrypt from 'bcryptjs';

/**
 * عدد جولات التشفير (Salt Rounds) لـ Bcrypt
 */
const SALT_ROUNDS = 10;

/**
 * تشفير كلمة المرور باستخدام مكتبة Bcrypt (أثناء تسجيل حساب جديد أو تغيير كلمة المرور)
 * @param password كلمة المرور النصية الصريحة
 * @returns التشفير الهاش المحمي
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * تشفير كلمة المرور بشكل متزامن (Synchronous Hash)
 * @param password كلمة المرور
 */
export function hashPasswordSync(password: string): string {
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

/**
 * التحقق من صحة كلمة المرور المدخلة مقارنة بالتشفير المخزن في قاعدة البيانات
 * @param password كلمة المرور المدخلة من المستخدم
 * @param hashedOriginal كلمة المرور المشفرة المحفوظة
 * @returns تطابق كلمة المرور (true / false)
 */
export async function verifyPassword(password: string, hashedOriginal: string): Promise<boolean> {
  if (!password || !hashedOriginal) return false;
  return bcrypt.compare(password, hashedOriginal);
}

/**
 * التحقق المتزامن من كلمة المرور (Synchronous Verify)
 * @param password كلمة المرور المدخلة
 * @param hashedOriginal كلمة المرور المشفرة المحفوظة
 */
export function verifyPasswordSync(password: string, hashedOriginal: string): boolean {
  if (!password || !hashedOriginal) return false;
  return bcrypt.compareSync(password, hashedOriginal);
}
