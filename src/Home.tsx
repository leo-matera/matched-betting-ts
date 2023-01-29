// pages/Home.js

import React, { useState, useEffect } from 'react';


interface Account {
    id: number,
    name: string,
    code: string,
    balance: number
}

function renderAccount(account: Account) {
    return <tr key={account.id}>
        <td>{account.name}</td>
        <td>{account.code}</td>
        <td>{account.balance}</td>
    </tr>
}

export default function Home() {

    const [accounts, setAccounts] = useState([] as Account[]);

    useEffect(() => {
        fetch('/.netlify/functions/getAccounts')
            .then(response => response.json() as Promise<Account[]>)
            .then(data => setAccounts(data));
    }, []);

    return <>
        <h2>Home</h2>
        {accounts.length === 0 ?
            <div>No leader scores to display. Would you like to ?</div>
            :
            <table className="table leader-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                {accounts.map(a => renderAccount(a))}
                </tbody>
            </table>
        }
    </>
}