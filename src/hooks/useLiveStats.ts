import { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/data/content";

interface LiveStats {
  daysTogether: number;
  daysUntilBirthday: number;
  isBirthdayToday: boolean;
  hasMounted: boolean;
}

export function useLiveStats(): LiveStats {
  const [stats, setStats] = useState<LiveStats>({
    daysTogether: 0,
    daysUntilBirthday: 0,
    isBirthdayToday: false,
    hasMounted: false,
  });

  useEffect(() => {
    // Current date (client-side execution avoids hydration mismatches)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ─── Calculate Days Together ───
    const anniversary = new Date(SITE_CONFIG.anniversaryDate);
    anniversary.setHours(0, 0, 0, 0);

    // If today is before the anniversary, it's 0 days. Otherwise, calculate difference.
    const diffTime = today.getTime() - anniversary.getTime();
    const daysTogether = diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0;

    // ─── Calculate Birthday Logic ───
    // Parse birthday (e.g., "2009-04-17" -> Month: 3 (0-indexed), Date: 17)
    const birthDateParts = SITE_CONFIG.birthdayDate.split('-');
    const birthMonth = parseInt(birthDateParts[1]) - 1;
    const birthDay = parseInt(birthDateParts[2]);

    const nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);

    // If birthday has passed this year, look to next year
    if (today.getTime() > nextBirthday.getTime()) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const isBirthdayToday =
      today.getMonth() === birthMonth && today.getDate() === birthDay;

    const bdayDiffTime = nextBirthday.getTime() - today.getTime();
    const daysUntilBirthday = isBirthdayToday ? 0 : Math.ceil(bdayDiffTime / (1000 * 60 * 60 * 24));

    setStats({
      daysTogether,
      daysUntilBirthday,
      isBirthdayToday,
      hasMounted: true,
    });
  }, []);

  return stats;
}
