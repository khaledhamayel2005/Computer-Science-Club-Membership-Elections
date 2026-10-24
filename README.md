# CAC Election Desk

نظام عربي RTL لمنظّمي انتخابات نادي علم الحاسوب والأمن السيبراني والذكاء الاصطناعي في جامعة بيرزيت. يسجل النظام استلام إذن المشاركة في **اقتراع ورقي فقط** ولا يخزن أصواتًا أو اختيارات انتخابية.

## البنية

- React + TypeScript + Vite، مستضاف كملفات ثابتة على GitHub Pages.
- Firebase Authentication للمصادقة وتغيير كلمة المرور.
- Cloud Firestore للتخزين والتحديث اللحظي بين أجهزة المكتب.
- معرّف Firestore حتمي لكل `electionId + normalizedStudentId` ومعاملة ذرّية لمنع التسجيل المكرر.
- قواعد Firestore تمنع أي قراءة أو كتابة إلا لحساب موجود وفعال في مجموعة `admins`.
- سجل تدقيق غير قابل للتعديل أو الحذف من تطبيق الويب.

## إعداد Firebase مرة واحدة

1. أنشئ مشروع Firebase، ثم Web App، وفعّل **Authentication → Email/Password** و**Cloud Firestore**.
2. في Authentication أنشئ المستخدم بالبريد `ayham@cac-election.local` وكلمة المرور الأولية المطلوبة. لا تضع كلمة المرور في المستودع أو متغيرات Vite.
3. انسخ UID للمستخدم وأنشئ مستند Firestore في `admins/{UID}` يحتوي:

   ```json
   { "active": true, "displayName": "أيهم", "username": "ayham" }
   ```

4. انشر القواعد: `npx firebase-tools login` ثم `npx firebase-tools use <PROJECT_ID>` ثم `npx firebase-tools deploy --only firestore:rules`.
5. أضف قيم Web App العامة التالية كـGitHub Actions repository secrets: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, و`VITE_FIREBASE_APP_ID`.
   أضف كذلك `VITE_ADMIN_USERNAME`, `VITE_ADMIN_EMAIL`, و`VITE_ADMIN_UID` لربط واجهة اسم المستخدم بحساب Firebase الحقيقي والتحقق الصريح من UID.
6. أضف `khaledhamayel2005.github.io` إلى Firebase Authentication → Settings → Authorized domains.
7. أعد تشغيل Workflow **Build and deploy GitHub Pages**.

إعداد Firebase الخاص بتطبيق الويب ليس مفتاحًا إداريًا، لكن حفظه في GitHub Secrets يبقي إدارة البيئات واضحة. لا تستخدم Service Account في الواجهة مطلقًا.

## التطوير

```bash
cp .env.example .env.local
npm install
npm test
npm run dev
```

المسار الأساسي مضبوط على `/Computer-Science-Club-Membership-Elections/` ليتوافق مع GitHub Pages.
