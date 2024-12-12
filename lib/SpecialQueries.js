// lib/SpecialQueries.js
import pool from './db';

//sales by items query
export async function getSalesByItem(startDate, endDate) {
    const query = `
        SELECT mi.Menu_Name, COUNT(oi.Order_Item) AS order_count
        FROM Menu_Items mi
        LEFT JOIN Order_Items oi ON mi.Menu_Name = oi.Order_Item
        LEFT JOIN Order_History oh ON oi.Order_Id = oh.Order_Id
        WHERE oh.Date_Time >= $1 AND oh.Date_Time <= $2
        GROUP BY mi.Menu_Name
        ORDER BY order_count DESC
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query, [startDate, endDate]);
        client.release();
        return result.rows;
    } catch (err) {
        console.error('Error fetching sales by item from database:', err);
        throw new Error('Failed to fetch sales by item');
    }
}

// X report query
export async function getXReport() {
    const query = `
        SELECT EXTRACT(HOUR FROM oh.Date_Time) AS hour,
                SUM(oh.price) AS total_sales,
                SUM(CASE WHEN c.Pay_Method = 'Card' THEN oh.price ELSE 0 END) AS card_total,
                SUM(CASE WHEN c.Pay_Method = 'Retail Swipe' THEN oh.price ELSE 0 END) AS retail_swipe_total,
                SUM(CASE WHEN c.Pay_Method = 'Dining Dollars' THEN oh.price ELSE 0 END) AS dining_dollars_total,
                SUM(CASE WHEN c.Pay_Method = 'Cash' THEN oh.price ELSE 0 END) AS cash_total
        FROM Order_History oh
        JOIN Customer c ON oh.Customer_Id = c.Customer_Id
        WHERE oh.Date_Time >= CURRENT_DATE
        GROUP BY EXTRACT(HOUR FROM oh.Date_Time)
        ORDER BY hour
    `;
  
    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows;
    } catch (err) {
        console.error('Error fetching X report from database:', err);
        throw new Error('Failed to fetch X report');
    }
}

// Z report query uses all below functions until getTotalRepeatCustomers
export async function getTotalSales() {
    const query = `
        SELECT SUM(price) AS total_sales
        FROM Order_History
        WHERE date_time::date = CURRENT_DATE
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching total sales from database:', err);
        throw new Error('Failed to fetch total sales');
    }
}

export async function getTotalCardSales() {
    const query = `
        SELECT COUNT(*) AS total_card
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE c.pay_method = 'Card'
        AND oh.date_time::date = CURRENT_DATE
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching total card sales from database:', err);
        throw new Error('Failed to fetch total card sales');
    }
}

export async function getTotalRetailSales() {
    const query = `
        SELECT COUNT(*) AS total_retail
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE c.pay_method = 'Retail Swipe'
        AND oh.date_time::date = CURRENT_DATE
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching total retail sales from database:', err);
        throw new Error('Failed to fetch total retail sales');
    }
}

export async function getTotalDiningDollarsSales() {
    const query = `
        SELECT COUNT(*) AS total_dining_dollars
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE c.pay_method = 'Dining Dollars'
        AND oh.date_time::date = CURRENT_DATE
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching total dining dollars sales from database:', err);
        throw new Error('Failed to fetch total dining dollars sales');
    }
}

export async function getTotalCashSales() {
    const query = `
        SELECT COUNT(*) AS total_cash
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE c.pay_method = 'Cash'
        AND oh.date_time::date = CURRENT_DATE
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching total cash sales from database:', err);
        throw new Error('Failed to fetch total cash sales');
    }
}

export async function getTotalUniqueCustomers() {
    const query = `
        SELECT COUNT(DISTINCT c.customer_email) AS total_unique_customers
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE oh.date_time::date = CURRENT_DATE
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching total unique customers from database:', err);
        throw new Error('Failed to fetch total unique customers');
    }
}

export async function getTotalRepeatCustomers() {
    const query = `
        SELECT COUNT(DISTINCT c.customer_email) AS repeat_customers
        FROM Order_History oh
        JOIN customer c ON oh.customer_id = c.customer_id
        WHERE c.customer_email IN (
            SELECT c2.customer_email
            FROM Order_History oh2
            JOIN customer c2 ON oh2.customer_id = c2.customer_id
            WHERE oh2.date_time::date = CURRENT_DATE
            GROUP BY c2.customer_email
            HAVING COUNT(oh2.customer_id) > 1
        )
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching total repeat customers from database:', err);
        throw new Error('Failed to fetch total repeat customers');
    }
}

export async function mostRecentOrder() {
    const query = `
        SELECT *
        FROM Customer 
        Order By Customer_Id DESC
        LIMIT 1;
    `;

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching most recent order from database:', err);
        throw new Error('Failed to fetch most recent order');
    }
}

// export async function addReview(menuItemId, rating, comment) {
//     const client = await pool.connect();
//     try {
//       await client.query('BEGIN');
  
//       const insertReviewQuery = `
//         INSERT INTO reviews (menu_item_id, rating, comment)
//         VALUES ($1, $2, $3)
//         RETURNING review_id
//       `;
//       const res = await client.query(insertReviewQuery, [menuItemId, rating, comment]);
  
//       const updateMenuItemQuery = `
//         UPDATE menu_items
//         SET rating_sum = rating_sum + $1, total_ratings = total_ratings + 1
//         WHERE menu_item_id = $2
//       `;
//       await client.query(updateMenuItemQuery, [rating, menuItemId]);
  
//       await client.query('COMMIT');
//       return res.rows[0].review_id;
//     } catch (error) {
//       await client.query('ROLLBACK');
//       console.error('Error adding review:', error);
//       throw new Error('Failed to add review');
//     } finally {
//       client.release();
//     }
//   }
  
//   export async function getAverageRating(menuItemId) {
//     const query = `
//       SELECT SUM(rating) AS rating_sum, COUNT(*) AS total_ratings
//       FROM reviews
//       WHERE menu_item_id = $1
//     `;
//     try {
//       const client = await pool.connect();
//       const res = await client.query(query, [menuItemId]);
//       client.release();
//       const { rating_sum, total_ratings } = res.rows[0];
//       return total_ratings > 0 ? rating_sum / total_ratings : 0;
//     } catch (err) {
//       console.error('Error fetching average rating from database:', err);
//       throw new Error('Failed to fetch average rating');
//     }
//   }

//   export async function fetchMenuItemDetails(menuItemId) {
//     const query = `
//       SELECT name, description, price, category
//       FROM menu_items
//       WHERE id = $1
//     `;
//     try {
//       const client = await pool.connect();
//       const res = await client.query(query, [menuItemId]);
//       client.release();
//       if (res.rows.length === 0) {
//         throw new Error('Menu item not found');
//       }
//       return res.rows[0];
//     } catch (err) {
//       console.error('Error fetching menu item details from database:', err);
//       throw new Error('Failed to fetch menu item details');
//     }
//   }