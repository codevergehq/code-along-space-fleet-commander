function AlertSystem({ alerts }) {
    return (
        <div className="fixed bottom-4 right-4 space-y-2">
            {alerts.map(alert => (
                <div
                    key={alert.id}
                    className={`p-3 rounded-md ${alert.type === 'error' ? 'bg-red-500' :
                            alert.type === 'success' ? 'bg-green-500' :
                                'bg-blue-500'
                        }`}
                >
                    {alert.message}
                </div>
            ))}
        </div>
    )
}

export default AlertSystem