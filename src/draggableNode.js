// draggableNode.js

export const DraggableNode = ({ type, label, data = null }) => {
    const onDragStart = (event) => {
        const nodeData = {
            nodeType: type,
            customConfig: data
        };
        console.log('Dragging node data:', nodeData);
        event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
        event.dataTransfer.effectAllowed = 'move';
    };
    
    return (
        <div
            onDragStart={onDragStart}
            draggable
            className={`
                cursor-move
                px-3 py-2
                border rounded
                bg-white
                hover:shadow-md
                transition-shadow
                ${type === 'custom' ? 'border-green-500 bg-green-50' : 'border-gray-300'}
            `}
            style={{
                cursor: 'grab', 
                minWidth: '80px', 
                height: '60px',
                display: 'flex', 
                alignItems: 'center',
                borderRadius: '8px',
                justifyContent: 'center', 
                flexDirection: 'column',
                borderColor: data?.borderColor ?? '#1C2536',
                backgroundColor: data?.backgroundColor ?? '#1C2536',
            }}
        >
          <span style={{ color: '#fff' }}>{label}</span>
        </div>
    );
};
