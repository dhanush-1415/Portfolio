import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Instagram, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ContactSectionProps {
  ref?: (node: HTMLDivElement | null) => void;
}

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(2, { message: 'Subject is required' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = forwardRef<HTMLDivElement, ContactSectionProps>(
  (props, ref) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<ContactFormValues>({
      resolver: zodResolver(contactFormSchema),
      defaultValues: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    });

    const onSubmit = async (data: ContactFormValues) => {
      setIsSubmitting(true);
      
      try {
        // In a real implementation, this would send the form data to a server
        // await apiRequest('POST', '/api/contact', data);
        
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll get back to you soon.",
          variant: "default",
        });
        
        form.reset();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <section 
        id="contact" 
        ref={ref}
        className="min-h-screen pt-28 pb-20 px-6 md:px-20 relative section-transition"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-sans tracking-wider">GET IN TOUCH</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Contact <span className="text-primary">Me</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass p-8 rounded-xl shadow-xl border border-primary/30 h-full">
                <h3 className="text-2xl font-serif font-bold mb-6">Let's Connect</h3>
                <p className="mb-8">Feel free to reach out to me for any inquiries, collaboration opportunities, or just to say hello!</p>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <a href="mailto:workofdhanu@gmail.com" className="text-primary hover:underline">workofdhanu@gmail.com</a>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Phone</h4>
                      <a href="tel:+919398263767" className="text-primary hover:underline">+91 9398263767</a>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Location</h4>
                      <p>3-85/3, Gandhi Nagar st, Nagari</p>
                      <p>Andhra Pradesh, 517590</p>
                    </div>
                  </div>
                  
                  {/* Social Media */}
                  <div className="pt-6">
                    <h4 className="font-medium mb-4">Connect with me</h4>
                    <div className="flex gap-4">
                      {[
                        { icon: <Linkedin className="h-4 w-4" />, url: "#", label: "LinkedIn" },
                        { icon: <Github className="h-4 w-4" />, url: "#", label: "GitHub" },
                        { icon: <Twitter className="h-4 w-4" />, url: "#", label: "Twitter" },
                        { icon: <Instagram className="h-4 w-4" />, url: "#", label: "Instagram" }
                      ].map((social, index) => (
                        <motion.a 
                          key={index}
                          href={social.url} 
                          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black hover:bg-secondary hover:text-white transition-colors"
                          aria-label={social.label}
                          whileHover={{ y: -3 }}
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass p-8 rounded-xl shadow-xl border border-primary/30 h-full">
                <h3 className="text-2xl font-serif font-bold mb-6">Send me a message</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              className="bg-background dark:bg-background border-primary/30 focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="john@example.com" 
                              type="email" 
                              {...field} 
                              className="bg-background dark:bg-background border-primary/30 focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="How can I help you?" 
                              {...field} 
                              className="bg-background dark:bg-background border-primary/30 focus:border-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message here..." 
                              rows={5}
                              {...field} 
                              className="bg-background dark:bg-background border-primary/30 focus:border-primary resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-black hover:text-white font-medium"
                      disabled={isSubmitting}
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
);

ContactSection.displayName = 'ContactSection';
export default ContactSection;
