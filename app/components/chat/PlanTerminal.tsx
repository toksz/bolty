import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('PlanTerminal');

interface FileEntry {
	type: 'file' | 'folder';
	content?: string;
}

export const PlanTerminal: React.FC = () => {
	const [planContent, setPlanContent] = useState<string>('');
	const files = useStore(workbenchStore.files);

	useEffect(() => {
		const updatePlan = async () => {
			try {
				const planFile = files['/plan.md'] as FileEntry | undefined;
				if (planFile && planFile.type === 'file' && planFile.content) {
					setPlanContent(planFile.content);
				}
			} catch (error) {
				logger.error('Failed to read plan.md:', error);
			}
		};

		updatePlan();
	}, [files]);

	return (
		<div className="plan-terminal">
			<pre className="plan-content">{planContent}</pre>
		</div>
	);
};