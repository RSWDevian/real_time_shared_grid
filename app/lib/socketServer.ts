import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function initializeSocket(httpServer: HTTPServer) {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
        },
    })

    // Handle client connections
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id)

        // Send initial grid state
        socket.on('request-grid', async () => {
            try {
                const blocks = await prisma.gridBlock.findMany()
                socket.emit('grid-state', blocks)
            } catch (error) {
                console.error('Error fetching grid state:', error)
            }
        })

        // Handle block booking
        socket.on('book-block', async ({ blockId, userEmail }) => {
            try {
                // Check if block is already occupied
                const block = await prisma.gridBlock.findUnique({
                    where: { blockId },
                })

                if (block?.occupied) {
                    socket.emit('error', { message: 'Block already occupied' })
                    return
                }

                // Update grid block
                const updated = await prisma.gridBlock.update({
                    where: { blockId },
                    data: { occupied: true, owner: userEmail },
                })

                // Create ownership record
                await prisma.ownership.create({
                    data: {
                        blockId,
                        owner: userEmail,
                        boughtAt: new Date(),
                    }
                })

                // Broadcasting to all clients
                io.emit('block-updated', updated);
            } catch (error) {
                console.error('Error booking block:', error)
                socket.emit('error', { message: 'Failed to book block' })
            }
        })

        // Handle block selling 
        socket.on('sell-block', async ({ blockId, userEmail }) => {
            try {
                // Verify ownership before selling
                const block = await prisma.gridBlock.findUnique({
                    where: { blockId },
                })

                if (block?.owner !== userEmail) {
                    socket.emit('error', { message: 'You do not own this block' })
                    return
                }

                // Update block to free it
                const updated = await prisma.gridBlock.update({
                    where: { blockId },
                    data: { occupied: false, owner: null },
                });

                // Update the ownership record
                await prisma.ownership.update({
                    where: { blockId },
                    data: {
                        soldAt: new Date(),
                    },
                });

                io.emit('block-updated', updated);
            } catch (error) {
                console.error('Error selling block:', error)
                socket.emit('error', { message: 'Failed to sell block' });
            }
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)
        })
    })

    return io
}