import React from 'react';

import { Feed } from '@/components/Feed';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';

const News = () => (
  <Main
    meta={<Meta title="Latest news" description="Latest aggregated news" />}
  >
    {AppConfig.datasetId && <Feed datasetId={AppConfig.datasetId} />}
    {!AppConfig.datasetId && (
      <p>
        Missing datasetId, please configure it in file{' '}
        <pre>src/utils/AppConfig.ts</pre>
      </p>
    )}
  </Main>
);

export default News;
