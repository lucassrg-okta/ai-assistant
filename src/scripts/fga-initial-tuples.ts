import { fga } from '@/lib/fga/client';
import { FINANCIAL_TERMS_POLICY_OBJECT } from '@/lib/fga/policy_versions';

async function seedFGA() {
  console.log('🚀 Seeding FGA relationships...');

  try {
    await fga.write({
      writes: [
        {
          user: 'user:*',
          relation: 'public_viewer',
          object: 'doc:retirement-basic',
        },
      ],
    });
    console.log('✅ Public document seeded');
  } catch (err: any) {
    if (err.responseData?.message?.includes('already existed')) {
      console.warn('⚠️ Public viewer relationship already existed, skipping.');
    } else {
      throw err;
    }
  }

  await fga.write({
    writes: [
      {
        user: `${FINANCIAL_TERMS_POLICY_OBJECT}#accepted`,
        relation: 'visible_with_terms',
        object: 'doc:retirement-advanced',
      },
      {
        user: `${FINANCIAL_TERMS_POLICY_OBJECT}#accepted`,
        relation: 'visible_with_terms',
        object: 'doc:zeko-competitive-summary',
      },
    ],
  });

  console.log('✅ Protected documents seeded');
  console.log('✅ Seeding complete!');
}

seedFGA().catch((err) => {
  console.error('❌ Failed seeding FGA:', err);
  process.exit(1);
});
