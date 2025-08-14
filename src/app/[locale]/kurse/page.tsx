import React from 'react';
import { useTranslations } from 'next-intl';
const Page: React.FC = () => {
	
	const t = useTranslations('Unternehmen');
	return (
		<div className="flex flex-col items-center">
			<h1 className="text-orange-400 font-black text-xl md:text-5xl">{t('title')}</h1>
		</div>
	);
};

export default Page;