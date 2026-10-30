/* ═══════════════════════════════════════════════════════════════
   CAISSE SALLE — i18n translations
   Supported: fr (Français) | ar (العربية) | en (English)
   ═══════════════════════════════════════════════════════════════ */

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', label: 'العربية',  flag: '🇲🇦', dir: 'rtl' },
  { code: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr' },
];

export const t = {

  /* ─── App ─────────────────────────────────────────────────── */
  appName: {
    fr: 'Caisse Salle',
    ar: 'صندوق القاعة',
    en: 'Caisse Salle',
  },
  appSub: {
    fr: 'Gestion quotidienne',
    ar: 'الإدارة اليومية',
    en: 'Daily management',
  },

  /* ─── Auth ────────────────────────────────────────────────── */
  secureAccess: {
    fr: 'Accès sécurisé',
    ar: 'وصول آمن',
    en: 'Secure access',
  },
  authSubtitle: {
    fr: 'Connectez-vous pour accéder au journal de caisse et aux rapports financiers.',
    ar: 'سجّل الدخول للوصول إلى سجل الصندوق والتقارير المالية.',
    en: 'Sign in to access the cash register and financial reports.',
  },
  email: {
    fr: 'Adresse e-mail',
    ar: 'البريد الإلكتروني',
    en: 'Email address',
  },
  emailPlaceholder: {
    fr: 'vous@exemple.com',
    ar: 'you@example.com',
    en: 'you@example.com',
  },
  password: {
    fr: 'Mot de passe',
    ar: 'كلمة المرور',
    en: 'Password',
  },
  signIn: {
    fr: 'Se connecter',
    ar: 'تسجيل الدخول',
    en: 'Sign in',
  },
  signingIn: {
    fr: 'Connexion…',
    ar: 'جارٍ التسجيل…',
    en: 'Signing in…',
  },
  securedBy: {
    fr: 'Accès sécurisé par Supabase Auth',
    ar: 'مؤمَّن بواسطة Supabase Auth',
    en: 'Secured by Supabase Auth',
  },
  signOut: {
    fr: 'Déconnexion',
    ar: 'تسجيل الخروج',
    en: 'Sign out',
  },

  /* ─── Roles ───────────────────────────────────────────────── */
  roleAdmin: {
    fr: 'Administrateur',
    ar: 'مدير',
    en: 'Administrator',
  },
  roleViewer: {
    fr: 'Lecture seule',
    ar: 'قراءة فقط',
    en: 'Read only',
  },
  fullAccess: {
    fr: 'Accès complet',
    ar: 'وصول كامل',
    en: 'Full access',
  },
  readOnly: {
    fr: 'Accès lecture seule',
    ar: 'وصول للقراءة فقط',
    en: 'Read-only access',
  },

  /* ─── Navigation ──────────────────────────────────────────── */
  dashboard: {
    fr: 'Tableau de bord',
    ar: 'لوحة القيادة',
    en: 'Dashboard',
  },
  operations: {
    fr: 'Opérations',
    ar: 'العمليات',
    en: 'Operations',
  },
  closing: {
    fr: 'Clôture du jour',
    ar: 'إقفال اليوم',
    en: 'Daily closing',
  },
  main: {
    fr: 'Principal',
    ar: 'رئيسي',
    en: 'Main',
  },
  accounting: {
    fr: 'Comptabilité',
    ar: 'المحاسبة',
    en: 'Accounting',
  },

  /* ─── Page titles ─────────────────────────────────────────── */
  overviewTitle: {
    fr: 'Vue d\'ensemble',
    ar: 'نظرة عامة',
    en: 'Overview',
  },
  transactionsTitle: {
    fr: 'Journal des opérations',
    ar: 'سجل العمليات',
    en: 'Transaction log',
  },
  closingTitle: {
    fr: 'Clôture quotidienne',
    ar: 'الإقفال اليومي',
    en: 'Daily closing',
  },

  /* ─── Dashboard ───────────────────────────────────────────── */
  hello: {
    fr: 'Bonjour',
    ar: 'مرحباً',
    en: 'Hello',
  },
  dashSubtitle: {
    fr: 'Voici la situation financière de votre caisse.',
    ar: 'إليك الوضع المالي لصندوقك.',
    en: 'Here is your cash register financial status.',
  },
  cashBalance: {
    fr: 'Solde caisse — Espèces',
    ar: 'رصيد الصندوق — نقداً',
    en: 'Cash balance — Physical',
  },
  cashDesc: {
    fr: 'Cash physique théorique calculé depuis toutes les opérations',
    ar: 'الرصيد النقدي المحسوب من جميع العمليات',
    en: 'Theoretical cash calculated from all transactions',
  },
  todayIncome: {
    fr: 'Entrées aujourd\'hui',
    ar: 'إيرادات اليوم',
    en: 'Today\'s income',
  },
  todayExpense: {
    fr: 'Dépenses aujourd\'hui',
    ar: 'مصاريف اليوم',
    en: 'Today\'s expenses',
  },
  txCount: {
    fr: 'Opérations',
    ar: 'العمليات',
    en: 'Transactions',
  },
  totalIncome: {
    fr: 'Total recettes',
    ar: 'إجمالي الإيرادات',
    en: 'Total income',
  },
  totalExpenses: {
    fr: 'Total dépenses',
    ar: 'إجمالي المصاريف',
    en: 'Total expenses',
  },
  bankDeposits: {
    fr: 'Dépôts banque',
    ar: 'الإيداعات البنكية',
    en: 'Bank deposits',
  },
  bankWithdrawals: {
    fr: 'Retraits banque',
    ar: 'سحوبات بنكية',
    en: 'Bank withdrawals',
  },
  allMethods: {
    fr: 'Toutes méthodes confondues',
    ar: 'جميع طرق الدفع',
    en: 'All payment methods',
  },
  cashOut: {
    fr: 'Sorties cash uniquement',
    ar: 'المدفوعات النقدية فقط',
    en: 'Cash payments only',
  },
  cashToBank: {
    fr: 'Cash versé en banque',
    ar: 'نقد تم إيداعه في البنك',
    en: 'Cash deposited to bank',
  },
  cashFromBank: {
    fr: 'Cash récupéré depuis banque',
    ar: 'نقد مسحوب من البنك',
    en: 'Cash retrieved from bank',
  },
  nonCashTitle: {
    fr: 'Recettes hors espèces',
    ar: 'الإيرادات غير النقدية',
    en: 'Non-cash receipts',
  },
  nonCashDesc: {
    fr: 'Ces montants ne s\'ajoutent pas au cash physique de la caisse.',
    ar: 'هذه المبالغ لا تُضاف إلى الرصيد النقدي الفعلي.',
    en: 'These amounts do not add to the physical cash balance.',
  },
  recentOps: {
    fr: 'Dernières opérations',
    ar: 'آخر العمليات',
    en: 'Recent transactions',
  },
  recentOpsDesc: {
    fr: 'Les opérations les plus récentes enregistrées.',
    ar: 'أحدث العمليات المسجّلة.',
    en: 'Most recently recorded transactions.',
  },
  viewAll: {
    fr: 'Voir tout →',
    ar: '← عرض الكل',
    en: 'View all →',
  },
  refresh: {
    fr: 'Actualiser',
    ar: 'تحديث',
    en: 'Refresh',
  },

  /* ─── Transactions ────────────────────────────────────────── */
  newOp: {
    fr: 'Nouvelle opération',
    ar: 'عملية جديدة',
    en: 'New transaction',
  },
  search: {
    fr: 'Rechercher une opération…',
    ar: 'البحث عن عملية…',
    en: 'Search transactions…',
  },
  showAll: {
    fr: 'Tout afficher',
    ar: 'عرض الكل',
    en: 'Show all',
  },
  colDate: {
    fr: 'Date',
    ar: 'التاريخ',
    en: 'Date',
  },
  colOp: {
    fr: 'Opération',
    ar: 'العملية',
    en: 'Operation',
  },
  colType: {
    fr: 'Type',
    ar: 'النوع',
    en: 'Type',
  },
  colMethod: {
    fr: 'Mode',
    ar: 'طريقة الدفع',
    en: 'Method',
  },
  colAmount: {
    fr: 'Montant',
    ar: 'المبلغ',
    en: 'Amount',
  },
  colActions: {
    fr: 'Actions',
    ar: 'إجراءات',
    en: 'Actions',
  },
  emptyTitle: {
    fr: 'Aucune opération',
    ar: 'لا توجد عمليات',
    en: 'No transactions',
  },
  emptyDesc: {
    fr: 'Les opérations apparaîtront ici une fois enregistrées.',
    ar: 'ستظهر العمليات هنا بعد تسجيلها.',
    en: 'Transactions will appear here once recorded.',
  },

  /* ─── Kind labels ─────────────────────────────────────────── */
  income: {
    fr: 'Recette',
    ar: 'إيراد',
    en: 'Income',
  },
  expense: {
    fr: 'Dépense',
    ar: 'مصروف',
    en: 'Expense',
  },
  deposit: {
    fr: 'Dépôt banque',
    ar: 'إيداع بنكي',
    en: 'Bank deposit',
  },
  withdrawal: {
    fr: 'Retrait banque',
    ar: 'سحب بنكي',
    en: 'Bank withdrawal',
  },
  opening: {
    fr: 'Solde initial',
    ar: 'الرصيد الافتتاحي',
    en: 'Opening balance',
  },

  /* ─── Payment methods ─────────────────────────────────────── */
  pmCash: {
    fr: 'Cash',
    ar: 'نقداً',
    en: 'Cash',
  },
  pmTPE: {
    fr: 'Carte TPE',
    ar: 'بطاقة TPE',
    en: 'Card TPE',
  },
  pmVirement: {
    fr: 'Virement',
    ar: 'تحويل بنكي',
    en: 'Transfer',
  },
  pmCheque: {
    fr: 'Chèque',
    ar: 'شيك',
    en: 'Cheque',
  },
  pmAutre: {
    fr: 'Autre',
    ar: 'أخرى',
    en: 'Other',
  },

  /* ─── Form ────────────────────────────────────────────────── */
  addOp: {
    fr: 'Ajouter une opération',
    ar: 'إضافة عملية',
    en: 'Add transaction',
  },
  editOp: {
    fr: 'Modifier une opération',
    ar: 'تعديل عملية',
    en: 'Edit transaction',
  },
  cashRegister: {
    fr: 'Journal de caisse',
    ar: 'سجل الصندوق',
    en: 'Cash register',
  },
  opType: {
    fr: 'Type d\'opération',
    ar: 'نوع العملية',
    en: 'Transaction type',
  },
  date: {
    fr: 'Date',
    ar: 'التاريخ',
    en: 'Date',
  },
  paymentMethod: {
    fr: 'Mode de paiement',
    ar: 'طريقة الدفع',
    en: 'Payment method',
  },
  description: {
    fr: 'Description',
    ar: 'الوصف',
    en: 'Description',
  },
  descPlaceholder: {
    fr: 'Ex. Paiement client, achat bouteille de gaz…',
    ar: 'مثال: دفعة عميل، شراء أسطوانة غاز…',
    en: 'E.g. Client payment, gas bottle purchase…',
  },
  category: {
    fr: 'Catégorie',
    ar: 'الفئة',
    en: 'Category',
  },
  amount: {
    fr: 'Montant (MAD)',
    ar: 'المبلغ (درهم)',
    en: 'Amount (MAD)',
  },
  notes: {
    fr: 'Note / référence',
    ar: 'ملاحظة / مرجع',
    en: 'Note / reference',
  },
  optional: {
    fr: '(facultatif)',
    ar: '(اختياري)',
    en: '(optional)',
  },
  notesPlaceholder: {
    fr: 'Référence, reçu, détail supplémentaire…',
    ar: 'مرجع، إيصال، تفاصيل إضافية…',
    en: 'Reference, receipt, additional details…',
  },
  nonCashHint: {
    fr: 'Les paiements par',
    ar: 'المدفوعات عبر',
    en: 'Payments by',
  },
  nonCashHint2: {
    fr: 'ne modifient pas le solde espèces de la caisse physique.',
    ar: 'لا تُعدِّل الرصيد النقدي الفعلي للصندوق.',
    en: 'do not affect the physical cash balance.',
  },
  cancel: {
    fr: 'Annuler',
    ar: 'إلغاء',
    en: 'Cancel',
  },
  save: {
    fr: 'Enregistrer l\'opération',
    ar: 'حفظ العملية',
    en: 'Save transaction',
  },
  saveEdit: {
    fr: 'Enregistrer les modifications',
    ar: 'حفظ التعديلات',
    en: 'Save changes',
  },
  saving: {
    fr: 'Enregistrement…',
    ar: 'جارٍ الحفظ…',
    en: 'Saving…',
  },

  /* ─── Confirm delete ──────────────────────────────────────── */
  deleteTitle: {
    fr: 'Supprimer cette opération ?',
    ar: 'حذف هذه العملية؟',
    en: 'Delete this transaction?',
  },
  deleteBody: {
    fr: 'Cette action est irréversible. L\'opération sera définitivement supprimée du journal.',
    ar: 'هذا الإجراء لا يمكن التراجع عنه. ستُحذف العملية نهائياً من السجل.',
    en: 'This action is irreversible. The transaction will be permanently deleted.',
  },
  deleteConfirm: {
    fr: 'Supprimer',
    ar: 'حذف',
    en: 'Delete',
  },

  /* ─── Notices ─────────────────────────────────────────────── */
  saved: {
    fr: 'Opération enregistrée.',
    ar: 'تم حفظ العملية.',
    en: 'Transaction saved.',
  },
  updated: {
    fr: 'Opération modifiée.',
    ar: 'تم تعديل العملية.',
    en: 'Transaction updated.',
  },
  deleted: {
    fr: 'Opération supprimée.',
    ar: 'تم حذف العملية.',
    en: 'Transaction deleted.',
  },
  closingSaved: {
    fr: 'Clôture enregistrée.',
    ar: 'تم حفظ الإقفال.',
    en: 'Closing saved.',
  },
  validationError: {
    fr: 'Saisissez une description et un montant positif.',
    ar: 'أدخل وصفاً ومبلغاً موجباً.',
    en: 'Enter a description and a positive amount.',
  },

  /* ─── Closing ─────────────────────────────────────────────── */
  closingDate: {
    fr: 'Date de clôture',
    ar: 'تاريخ الإقفال',
    en: 'Closing date',
  },
  theoreticalCash: {
    fr: 'Cash théorique',
    ar: 'الرصيد النظري',
    en: 'Theoretical cash',
  },
  cashReceipts: {
    fr: 'Recettes cash',
    ar: 'الإيرادات النقدية',
    en: 'Cash receipts',
  },
  cashExpenses: {
    fr: 'Dépenses cash',
    ar: 'المصاريف النقدية',
    en: 'Cash expenses',
  },
  closingEntry: {
    fr: 'Saisie de la clôture',
    ar: 'إدخال بيانات الإقفال',
    en: 'Enter closing data',
  },
  countedCash: {
    fr: 'Cash compté (MAD)',
    ar: 'النقد المعدود (درهم)',
    en: 'Counted cash (MAD)',
  },
  countedPlaceholder: {
    fr: 'Saisissez le montant compté',
    ar: 'أدخل المبلغ المعدود',
    en: 'Enter counted amount',
  },
  closingNote: {
    fr: 'Note de clôture',
    ar: 'ملاحظة الإقفال',
    en: 'Closing note',
  },
  closingNotePlaceholder: {
    fr: 'Écart expliqué, dépôt effectué…',
    ar: 'تفسير الفرق، الإيداع المنجز…',
    en: 'Explained variance, deposit made…',
  },
  register: {
    fr: 'Enregistrer',
    ar: 'تسجيل',
    en: 'Register',
  },
  registering: {
    fr: 'Enregistrement…',
    ar: 'جارٍ التسجيل…',
    en: 'Registering…',
  },
  balanced: {
    fr: '✓ Caisse équilibrée',
    ar: '✓ الصندوق متوازن',
    en: '✓ Cash balanced',
  },
  surplus: {
    fr: 'Excédent de',
    ar: 'فائض بمقدار',
    en: 'Surplus of',
  },
  shortage: {
    fr: 'Manque de',
    ar: 'عجز بمقدار',
    en: 'Shortage of',
  },
  theoretical: {
    fr: 'Théorique',
    ar: 'النظري',
    en: 'Theoretical',
  },
  real: {
    fr: 'Réel',
    ar: 'الفعلي',
    en: 'Real',
  },
  readOnlyClosing: {
    fr: 'Accès lecture seule — La clôture ne peut être saisie que par l\'administrateur.',
    ar: 'وصول للقراءة فقط — لا يمكن إدخال الإقفال إلا من قِبل المدير.',
    en: 'Read-only access — Closing can only be entered by the administrator.',
  },
  recentClosings: {
    fr: 'Clôtures récentes',
    ar: 'الإقفالات الأخيرة',
    en: 'Recent closings',
  },
  noClosings: {
    fr: 'Aucune clôture',
    ar: 'لا توجد إقفالات',
    en: 'No closings',
  },
  noClosingsDesc: {
    fr: 'Les clôtures enregistrées apparaîtront ici.',
    ar: 'ستظهر الإقفالات المسجّلة هنا.',
    en: 'Recorded closings will appear here.',
  },
  colTheoretical: {
    fr: 'Théorique',
    ar: 'النظري',
    en: 'Theoretical',
  },
  colReal: {
    fr: 'Réel compté',
    ar: 'الفعلي المعدود',
    en: 'Counted',
  },
  colVariance: {
    fr: 'Écart',
    ar: 'الفرق',
    en: 'Variance',
  },
  colNote: {
    fr: 'Note',
    ar: 'ملاحظة',
    en: 'Note',
  },

  /* ─── Profile error ───────────────────────────────────────── */
  profileError: {
    fr: 'Profil non configuré',
    ar: 'الملف الشخصي غير مُعَد',
    en: 'Profile not configured',
  },
  profileErrorDesc: {
    fr: 'Votre compte est connecté, mais aucun profil avec un rôle n\'est configuré. Demandez à l\'administrateur d\'ajouter votre ligne dans la table profiles.',
    ar: 'حسابك متصل، لكن لم يتم تهيئة ملف شخصي بدور. اطلب من المدير إضافة سطرك في جدول profiles.',
    en: 'Your account is connected, but no profile with a role is configured. Ask the administrator to add your row in the profiles table.',
  },

  /* ─── Setup ───────────────────────────────────────────────── */
  setupTitle: {
    fr: 'Connexion Supabase requise',
    ar: 'مطلوب اتصال Supabase',
    en: 'Supabase connection required',
  },

  /* ─── Loading ─────────────────────────────────────────────── */
  loading: {
    fr: 'Chargement de l\'application…',
    ar: 'جارٍ تحميل التطبيق…',
    en: 'Loading application…',
  },

  /* ─── Footer ──────────────────────────────────────────────── */
  footer: {
    fr: 'Les montants sont saisis manuellement. Vérifiez les relevés TPE et bancaires séparément.',
    ar: 'المبالغ تُدخَل يدوياً. تحقق من كشوفات TPE والبنك بشكل منفصل.',
    en: 'Amounts are entered manually. Verify TPE and bank statements separately.',
  },

  /* ─── Categories ──────────────────────────────────────────── */
  categories: {
    fr: ['Recette salle','Abonnement / client','Bouteille de gaz','Achat marchandise','Loyer','Électricité / eau','Salaire','Entretien','Transport','Fournitures','Dépôt banque','Retrait banque','Autre','Solde initial'],
    ar: ['إيراد القاعة','اشتراك / عميل','أسطوانة غاز','شراء بضاعة','إيجار','كهرباء / ماء','راتب','صيانة','نقل','لوازم','إيداع بنكي','سحب بنكي','أخرى','الرصيد الافتتاحي'],
    en: ['Hall income','Subscription / client','Gas bottle','Merchandise purchase','Rent','Electricity / water','Salary','Maintenance','Transport','Supplies','Bank deposit','Bank withdrawal','Other','Opening balance'],
  },
};

/* ─── Hook ────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react';

export function useLanguage() {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('cs_lang') || 'fr'
  );

  const setLang = (code) => {
    localStorage.setItem('cs_lang', code);
    setLangState(code);
    const dir = LANGUAGES.find(l => l.code === code)?.dir || 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', code);
  };

  useEffect(() => {
    const dir = LANGUAGES.find(l => l.code === lang)?.dir || 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, []);

  /* tr(key) → translated string */
  const tr = (key) => {
    const entry = t[key];
    if (!entry) return key;
    return entry[lang] ?? entry['fr'] ?? key;
  };

  return { lang, setLang, tr };
}
