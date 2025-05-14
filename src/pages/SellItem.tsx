
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Upload, ChartBar } from 'lucide-react';

// UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import BidHistoryGraph from '@/components/BidHistoryGraph';

// Form schema validation
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(1000),
  startingPrice: z.coerce.number().positive({ message: "Starting price must be positive" }),
  reservePrice: z.coerce.number().positive({ message: "Reserve price must be positive" }).optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  endDate: z.string().refine(val => {
    const date = new Date(val);
    return date > new Date();
  }, { message: "End date must be in the future" }),
  endTime: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const SellItem = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sample data for the market insights
  const sampleAveragePrices = [
    { month: 'Jan', price: 12000 },
    { month: 'Feb', price: 13500 },
    { month: 'Mar', price: 13200 },
    { month: 'Apr', price: 14500 },
    { month: 'May', price: 15800 },
    { month: 'Jun', price: 16200 },
  ];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      startingPrice: 0,
      reservePrice: undefined,
      category: '',
      endDate: '',
      endTime: '',
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      
      // Limit to 5 images
      if (images.length + filesArray.length > 5) {
        toast({
          title: "Maximum 5 images allowed",
          description: "Please select fewer images.",
          variant: "destructive"
        });
        return;
      }
      
      // Create preview URLs
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...filesArray]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
      
      // Here you would normally upload images and submit data to your backend
      console.log("Form data:", data);
      console.log("Images:", images);
      console.log("End date and time:", endDateTime);
      
      // Simulate successful submission
      toast({
        title: "Auction created successfully!",
        description: "Your item has been listed for auction.",
      });
      
      // Redirect to auction page
      setTimeout(() => navigate("/auctions"), 1500);
    } catch (error) {
      console.error("Error submitting auction:", error);
      toast({
        title: "Error creating auction",
        description: "There was a problem creating your auction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sell Item</CardTitle>
              <CardDescription>
                Create a new auction listing to sell your item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a descriptive title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Image upload section */}
                  <div>
                    <FormLabel>Images (Max 5)</FormLabel>
                    <div className="mt-2">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                            <img 
                              src={url} 
                              alt={`Preview ${index}`} 
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        
                        {previewUrls.length < 5 && (
                          <label className="border border-dashed rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Upload</span>
                            <input 
                              type="file"
                              onChange={handleImageUpload}
                              accept="image/*"
                              className="hidden"
                              multiple
                            />
                          </label>
                        )}
                      </div>
                      <FormDescription>
                        Upload clear, high-quality images of your item from different angles.
                      </FormDescription>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed description, condition, specifications, etc." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Starting Price (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormDescription>
                            The minimum bid to start the auction
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reservePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reserve Price (₹) (Optional)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum price you're willing to accept
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="">Select a category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing & Accessories</option>
                            <option value="collectibles">Collectibles</option>
                            <option value="home">Home & Garden</option>
                            <option value="vehicles">Vehicles</option>
                            <option value="jewelry">Jewelry & Watches</option>
                            <option value="toys">Toys & Hobbies</option>
                            <option value="art">Art & Antiques</option>
                            <option value="sports">Sporting Goods</option>
                            <option value="other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <CardFooter className="px-0 pb-0">
                    <Button 
                      type="submit" 
                      className="w-full bg-auction-blue hover:bg-auction-darkBlue"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Auction..." : "Create Auction"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar with tips and market insights */}
        <div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBar className="mr-2 h-5 w-5" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Recent Sales in Your Category</h4>
                    <BidHistoryGraph data={sampleAveragePrices} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Selling Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-auction-blue mr-2 font-bold">•</span>
                    <span>Use high-quality, well-lit photos from multiple angles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-auction-blue mr-2 font-bold">•</span>
                    <span>Be detailed and honest about the item's condition</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-auction-blue mr-2 font-bold">•</span>
                    <span>Set a reasonable starting price to attract bidders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-auction-blue mr-2 font-bold">•</span>
                    <span>End auctions during peak hours (evenings and weekends)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-auction-blue mr-2 font-bold">•</span>
                    <span>Respond quickly to questions from potential buyers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellItem;
