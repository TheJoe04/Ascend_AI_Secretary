import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo-dental' },
    update: {},
    create: {
      name: 'Demo Dental Practice',
      slug: 'demo-dental',
      twilioNumber: '+1234567890',
      agentConfig: {
        name: 'Jamie',
        voice: 'alloy',
        persona: 'professional receptionist',
        systemPrompt: 'You are Jamie, a professional and friendly receptionist for Demo Dental Practice. Help callers with appointments, questions, and general information.'
      }
    }
  })

  console.log('✅ Created organization:', organization.name)

  // Hash password
  const hashedPassword = await bcrypt.hash('Demo2024!', 12)

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@ascendai.com' },
    update: {},
    create: {
      email: 'demo@ascendai.com',
      password: hashedPassword,
      role: 'admin',
      organizationId: organization.id
    }
  })

  console.log('✅ Created user:', user.email)

  // Create demo calls
  const demoCalls = [
    {
      organizationId: organization.id,
      twilioCallSid: 'CA1234567890abcdef',
      callerName: 'John Smith',
      callerNumber: '+1 (555) 123-4567',
      duration: 180,
      status: 'answered',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      transcript: 'Hi, I\'m interested in scheduling a dental cleaning. Do you have any availability next week?',
      tags: ['appointment', 'cleaning'],
      notes: 'Interested in cleaning, follow up with scheduling'
    },
    {
      organizationId: organization.id,
      twilioCallSid: 'CA1234567890abcdef1',
      callerName: 'Sarah Johnson',
      callerNumber: '+1 (555) 234-5678',
      duration: 0,
      status: 'missed',
      sentiment: 'neutral',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      tags: ['follow-up'],
      notes: 'Called twice today, no answer'
    },
    {
      organizationId: organization.id,
      twilioCallSid: 'CA1234567890abcdef2',
      callerName: 'Mike Davis',
      callerNumber: '+1 (555) 345-6789',
      duration: 420,
      status: 'answered',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      transcript: 'I need to schedule a root canal procedure. What are your available times?',
      tags: ['procedure', 'root-canal'],
      notes: 'Urgent procedure needed, high priority'
    },
    {
      organizationId: organization.id,
      twilioCallSid: 'CA1234567890abcdef3',
      callerName: 'Lisa Chen',
      callerNumber: '+1 (555) 456-7890',
      duration: 90,
      status: 'voicemail',
      sentiment: 'neutral',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      transcript: 'Hi, this is Lisa from TechCorp. We\'re looking for dental services for our employees. Please call me back.',
      tags: ['voicemail', 'corporate'],
      notes: 'Corporate client inquiry'
    },
    {
      organizationId: organization.id,
      twilioCallSid: 'CA1234567890abcdef4',
      callerName: 'Robert Wilson',
      callerNumber: '+1 (555) 567-8901',
      duration: 240,
      status: 'answered',
      sentiment: 'negative',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      transcript: 'I\'m not happy with my last visit. The billing was confusing and I had to wait too long.',
      tags: ['complaint', 'billing'],
      notes: 'Customer complaint, needs follow-up'
    },
    {
      organizationId: organization.id,
      twilioCallSid: 'CA1234567890abcdef5',
      callerName: 'Emily Rodriguez',
      callerNumber: '+1 (555) 678-9012',
      duration: 150,
      status: 'answered',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      transcript: 'Thank you so much for the excellent care! I want to schedule my next cleaning.',
      tags: ['satisfied', 'cleaning'],
      notes: 'Happy customer, wants to schedule follow-up'
    },
    {
      organizationId: organization.id,
      twilioCallSid: 'CA1234567890abcdef6',
      callerName: 'David Kim',
      callerNumber: '+1 (555) 789-0123',
      duration: 0,
      status: 'missed',
      sentiment: 'neutral',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      tags: ['follow-up'],
      notes: 'Missed call, no voicemail'
    },
    {
      organizationId: organization.id,
      twilioCallSid: 'CA1234567890abcdef7',
      callerName: 'Maria Garcia',
      callerNumber: '+1 (555) 890-1234',
      duration: 320,
      status: 'answered',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      transcript: 'I need to reschedule my appointment for next week. Something came up with work.',
      tags: ['reschedule', 'appointment'],
      notes: 'Needs to reschedule existing appointment'
    }
  ]

  for (const callData of demoCalls) {
    await prisma.call.create({
      data: callData
    })
  }

  console.log('✅ Created demo calls')

  // Create demo leads
  const demoLeads = [
    {
      organizationId: organization.id,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      company: 'Smith & Associates',
      score: 'Warm',
      status: 'Contacted',
      source: 'Phone Call',
      lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      notes: 'Interested in dental cleaning, follow up in 2 days',
      tags: ['dental-cleaning', 'appointment'],
      calls: 1,
      messages: 0,
      conversionProbability: 75
    },
    {
      organizationId: organization.id,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678',
      company: 'Johnson Dental',
      score: 'Cold',
      status: 'New',
      source: 'Website',
      lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      notes: 'Called twice, no answer. Try different time',
      tags: ['website', 'follow-up'],
      calls: 2,
      messages: 1,
      conversionProbability: 30
    },
    {
      organizationId: organization.id,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 (555) 345-6789',
      company: 'Davis Family Practice',
      score: 'Hot',
      status: 'Ready to Schedule',
      source: 'Phone Call',
      lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      notes: 'Urgent root canal needed, high priority',
      tags: ['urgent', 'root-canal'],
      calls: 1,
      messages: 0,
      conversionProbability: 95
    }
  ]

  for (const leadData of demoLeads) {
    await prisma.lead.create({
      data: leadData
    })
  }

  console.log('✅ Created demo leads')

  // Create demo messages
  const demoMessages = [
    {
      organizationId: organization.id,
      type: 'email',
      from: 'john.smith@email.com',
      to: 'info@demodental.com',
      subject: 'Re: Dental Cleaning Appointment',
      content: 'Thank you for the call today. I would like to schedule the cleaning for next Tuesday at 2 PM if available.',
      status: 'read',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      tags: ['appointment', 'follow-up']
    },
    {
      organizationId: organization.id,
      type: 'sms',
      from: '+1 (555) 234-5678',
      to: '+1 (555) 000-0000',
      content: 'Hi, I missed your call earlier. Can you call me back at 3 PM?',
      status: 'delivered',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      tags: ['callback']
    }
  ]

  for (const messageData of demoMessages) {
    await prisma.message.create({
      data: messageData
    })
  }

  console.log('✅ Created demo messages')

  console.log('🎉 Seed completed successfully!')
  console.log('📧 Demo login: demo@ascendai.com')
  console.log('🔑 Demo password: Demo2024!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
