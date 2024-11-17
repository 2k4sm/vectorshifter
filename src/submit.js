// submit.js

import { useStore } from './store';
import { useState } from 'react';

export const SubmitButton = () => {
    const nodes = useStore(state => state.nodes);
    const edges = useStore(state => state.edges);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            
            const pipelineData = {
                nodes: nodes.map(node => ({ id: node.id })),
                edges: edges.map(edge => ({
                    source: edge.source,
                    target: edge.target
                }))
            };

            const url = new URL('http://localhost:8000/pipelines/parse');
            url.searchParams.append('pipeline_data', JSON.stringify(pipelineData));

            console.log('Sending pipeline data:', pipelineData);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            const message = `Pipeline Analysis Results:\n\n` +
                `Number of Nodes: ${data.num_nodes}\n` +
                `Number of Edges: ${data.num_edges}\n` +
                `Is a DAG (Directed Acyclic Graph): ${data.is_dag ? 'Yes' : 'No'}\n\n` +
                `${!data.is_dag ? 'Warning: Your pipeline contains cycles!' : 'Pipeline structure is valid!'}`;

            alert(message);

        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('Error submitting pipeline: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 flex items-center justify-center">
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`
                    px-6 py-2 rounded-lg font-medium text-white
                    ${isLoading 
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-green-700 active:bg-gray-800'
                    }
                    transition-colors duration-200
                    shadow-lg hover:shadow-xl
                    flex items-center gap-2
                `}
            >
                {isLoading ? (
                    <>
                        <span className="animate-spin">⚪</span>
                        Processing...
                    </>
                ) : (
                    'Submit Pipeline'
                )}
            </button>
        </div>
    );
};