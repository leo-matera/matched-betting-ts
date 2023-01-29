import { Handler } from '@netlify/functions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const handler: Handler = async (event, context) => {
    // load all scores from the database and include player name
    // from the players table.
    const allAccounts = await prisma.account.findMany({
        include: {
            betting_site: {
                select: {
                    description: true
                }
            },
            person: {
                select: {
                    code: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify(allAccounts.map(account => (
                // flatten player name into score entry
                { id: account.id, name: account.betting_site.description, code: account.person.code, balance: account.balance }
            ))
            , (key, value) =>
                // need to add a custom serializer because CockroachDB IDs map to
                // JavaScript BigInts, which JSON.stringify has trouble serializing.
                typeof value === 'bigint'
                    ? value.toString()
                    : value
        )
    }
};

export { handler }